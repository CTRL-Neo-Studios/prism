import semver from 'semver'
import type {H3Event} from 'h3'
import {channelPointerKey, releaseSchema} from '#layers/apps/shared/model'
import type {Release} from '#layers/apps/shared/model'

export interface FoundRelease {
	config: ChannelConfig
	release: Release | null
}

// ponytail: per-instance 30s cache, so a new publish reaches each server instance within 30s
const readChannel = defineCachedFunction(
	async (app: string, channel: string) => (await useS3().getJson(channelPointerKey(app, channel), releaseSchema))?.data ?? null,
	{name: 'apps-channel', maxAge: 30, getKey: (app: string, channel: string) => `${app}:${channel}`}
)

/**
 * Newest release offered on a channel (the channel plus everything it includes), after the access check.
 * `usable` filters candidates first, so a platform a newer prerelease skipped still gets the newest build that has it.
 */
export async function findRelease(event: H3Event, app: string, channel: string, usable: (release: Release) => boolean = () => true): Promise<FoundRelease> {
	const config = channelConfig(app, channel)
	await assertChannelAccess(event, app, channel, config)
	const candidates = await Promise.all([channel, ...(config.includes ?? [])].map(c => readChannel(app, c)))
	const release = candidates.reduce<Release | null>(
		(best, r) => r && usable(r) && (!best || semver.gt(r.version, best.version)) ? r : best,
		null
	)
	return {config, release}
}
