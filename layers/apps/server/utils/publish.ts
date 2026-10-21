import {setTimeout as sleep} from 'node:timers/promises'
import semver from 'semver'
import {z} from 'zod/v4'
import {channelPointerKey, fileName, platformKey, releaseFileKey, releaseKey, releaseSchema, slug, version} from '#layers/apps/shared/model'
import type {Release} from '#layers/apps/shared/model'

/** What CI sends to start a release: metadata, .sig contents and sizes; the files themselves go to presigned URLs. */
export const startReleaseSchema = z.object({
	version,
	/** default: the prerelease tag (1.0.0-beta.2 → beta), else stable */
	channel: slug.optional(),
	notes: z.string().max(10_000).optional(),
	platforms: z.record(platformKey, z.object({file: fileName, size: z.number().int().positive(), signature: z.string().min(1).max(4096)})),
	installers: z.record(platformKey, z.object({file: fileName, size: z.number().int().positive()})).default({})
}).refine(r => Object.keys(r.platforms).length > 0, 'at least one updater platform is required')
export type StartRelease = z.infer<typeof startReleaseSchema>

export interface StartedRelease {
	release: Release
	/** file name → presigned PUT URL, valid for an hour */
	uploads: Record<string, string>
}

/** Prerelease tag picks the channel (1.0.0-beta.2 → beta); plain versions go to stable. */
export function defaultChannel(ver: string) {
	const tag = semver.prerelease(ver)?.[0]
	return typeof tag === 'string' ? tag : 'stable'
}

/** Files the release must contain, by name → expected size. Rejects the same name used twice with different sizes. */
function expectedFiles(release: Pick<Release, 'platforms' | 'installers'>): Record<string, number> {
	const files: Record<string, number> = {}
	for (const {file, size} of [...Object.values(release.platforms), ...Object.values(release.installers)]) {
		if (Object.hasOwn(files, file) && files[file] !== size)
			throw createError({statusCode: 400, statusMessage: `File ${file} is listed twice with different sizes`})
		files[file] = size
	}
	return files
}

/**
 * Registers a pending release and returns upload URLs. Idempotent per version while pending (a CI re-run re-uploads);
 * 409 once published, so a version can never be replaced. The version must beat the channel's current release.
 */
export async function startRelease(app: string, input: StartRelease): Promise<StartedRelease> {
	const channel = input.channel ?? defaultChannel(input.version)
	channelConfig(app, channel)
	const s3 = useS3()

	const current = await s3.getJson(channelPointerKey(app, channel), releaseSchema)
	if (current && !semver.gt(input.version, current.data.version))
		throw createError({statusCode: 409, statusMessage: `${input.version} is not newer than ${channel}'s ${current.data.version}`})

	const existing = await s3.getJson(releaseKey(app, input.version), releaseSchema)
	if (existing?.data.status === 'published')
		throw createError({statusCode: 409, statusMessage: `${app} ${input.version} is already published`})

	const release: Release = {app, version: input.version, channel, status: 'pending', notes: input.notes, platforms: input.platforms, installers: input.installers}
	const files = expectedFiles(release)
	try {
		await s3.putJson(releaseKey(app, input.version), release, existing ? {ifMatch: existing.etag} : {ifNoneMatch: true})
	}
	catch (error) {
		if (error instanceof S3ConflictError) throw createError({statusCode: 409, statusMessage: `Another run is starting ${app} ${input.version}; re-run the workflow`})
		throw error
	}

	const uploads: Record<string, string> = {}
	for (const file of Object.keys(files)) uploads[file] = await s3.presignPut(releaseFileKey(app, input.version, file))
	return {release, uploads}
}

/**
 * Publishes a pending release: every file must exist with the declared size, and the version must beat the channel's
 * current release (another run may have published meanwhile). The release is only marked published once it's on top.
 */
export async function publishRelease(app: string, ver: string): Promise<Release> {
	const s3 = useS3()
	const stored = await s3.getJson(releaseKey(app, ver), releaseSchema)
	if (!stored) throw createError({statusCode: 404, statusMessage: `${app} ${ver} was never started`})
	if (stored.data.status === 'published') return stored.data

	const missing: string[] = []
	for (const [file, size] of Object.entries(expectedFiles(stored.data))) {
		const actual = await s3.size(releaseFileKey(app, ver, file))
		if (actual !== size) missing.push(actual === null ? `${file} (missing)` : `${file} (${actual} bytes, expected ${size})`)
	}
	if (missing.length) throw createError({statusCode: 422, statusMessage: `Upload incomplete: ${missing.join(', ')}`})

	const published: Release = {...stored.data, status: 'published', pub_date: new Date().toISOString()}
	await movePointer(channelPointerKey(app, stored.data.channel), published)
	await s3.putJson(releaseKey(app, ver), published)
	return published
}

/**
 * Puts `ours` on the channel pointer unless a newer version is already there, then confirms it stuck: megas4 doesn't
 * enforce If-Match atomically for simultaneous writes, so two racing publishes can both "win" a conditional write.
 * Re-reading after a pause and retrying means the newest racing version always ends up on the pointer.
 * The publish job's per-app concurrency group keeps this path rare in the first place.
 */
async function movePointer(pointerKey: string, ours: Release) {
	const s3 = useS3()
	for (let attempt = 0; attempt < 5; attempt++) {
		const now = await s3.getJson(pointerKey, releaseSchema)
		if (now && semver.gt(now.data.version, ours.version))
			throw createError({statusCode: 409, statusMessage: `${ours.version} is not newer than ${ours.channel}'s ${now.data.version}`})
		if (now?.data.version === ours.version && attempt > 0) return
		await s3.putJson(pointerKey, ours, now ? {ifMatch: now.etag} : {ifNoneMatch: true}).catch((error) => {
			if (!(error instanceof S3ConflictError)) throw error
		})
		await sleep(1000 + Math.random() * 1000)
	}
	throw createError({statusCode: 409, statusMessage: 'Channel kept changing during publish; re-run the workflow'})
}
