// Storage model shared by the server (server/utils) and the apps:access script. Pure TS: no Nitro auto-imports here.
import {createHash} from 'node:crypto'
import semver from 'semver'
import {z} from 'zod/v4'

export const ACCESS_FILE_KEY = 'apps/_access.json'

/** Slugs for apps, channels, users: also used as storage path segments, so no slashes or dots. */
export const slug = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/)

/** Grants are "app:channel"; "*" on either side matches anything. */
export const grant = z.string().regex(/^([a-z0-9][a-z0-9-]*|\*):([a-z0-9][a-z0-9-]*|\*)$/)

/** apps/_access.json: users keyed by name; only token hashes are stored, never the tokens themselves. */
export const accessFileSchema = z.object({
	users: z.record(slug, z.object({
		token: z.string().startsWith('sha256:'),
		grants: z.array(grant),
		note: z.string().optional()
	}))
})
export type AccessFile = z.infer<typeof accessFileSchema>

export const hashToken = (token: string) => `sha256:${createHash('sha256').update(token).digest('hex')}`

export function grantMatches(grantValue: string, app: string, channel: string) {
	const [grantApp, grantChannel] = grantValue.split(':')
	return (grantApp === '*' || grantApp === app) && (grantChannel === '*' || grantChannel === channel)
}

/** Strict semver (1.0.0-alpha.1), the only form Tauri's updater and bundler accept. */
export const version = z.string().refine(v => semver.valid(v) === v, 'must be a semver version like 1.0.0 or 1.0.0-alpha.1')

/** File names inside a version folder; never paths, so a release can't point outside its own folder. */
export const fileName = z.string().regex(/^[\w.-]{1,128}$/)

/** Tauri platform keys: "<target>-<arch>" (windows-x86_64, darwin-aarch64, linux-x86_64, ...). */
export const platformKey = z.string().regex(/^(windows|darwin|linux)-(x86_64|aarch64|i686|armv7)$/)

export const releaseFile = z.object({file: fileName, size: z.number().int().positive()})

/**
 * apps/<app>/<version>/release.json. Created as `pending` when CI starts a release, flipped to `published` once every
 * file is verified, then copied to apps/<app>/channels/<channel>.json, the pointer the update feeds read.
 */
export const releaseSchema = z.object({
	app: slug,
	version,
	channel: slug,
	status: z.enum(['pending', 'published']),
	notes: z.string().max(10_000).optional(),
	/** RFC 3339; set when published */
	pub_date: z.iso.datetime({offset: true}).optional(),
	/** updater bundles + the contents of their .sig files */
	platforms: z.record(platformKey, releaseFile.extend({signature: z.string().min(1).max(4096)})),
	/** first-install downloads (NSIS setup, .dmg, AppImage), keyed like platforms */
	installers: z.record(platformKey, releaseFile).default({})
})
export type Release = z.infer<typeof releaseSchema>

export const releaseKey = (app: string, ver: string) => `apps/${app}/${ver}/release.json`
export const releaseFileKey = (app: string, ver: string, file: string) => `apps/${app}/${ver}/${file}`
export const channelPointerKey = (app: string, channel: string) => `apps/${app}/channels/${channel}.json`
