import type {H3Event} from 'h3'
import {ACCESS_FILE_KEY, accessFileSchema, grantMatches, hashToken} from '#layers/apps/shared/model'

// ponytail: per-instance 30s cache, so grants and revocations apply within 30s; move to Postgres for instant changes.
// swr off: a stale-while-revalidate hit would honor a revoked token once more after the TTL.
const accessIndex = defineCachedFunction(async () => {
	const file = await useS3().getJson(ACCESS_FILE_KEY, accessFileSchema)
	const index: Record<string, {user: string, grants: string[]}> = {}
	for (const [user, entry] of Object.entries(file?.data.users ?? {})) index[entry.token] = {user, grants: entry.grants}
	return index
}, {name: 'apps-access', maxAge: 30, swr: false, getKey: () => 'index'})

/** Throws 401 (missing/unknown token) or 403 (no grant) for restricted channels; public channels pass. */
export async function assertChannelAccess(event: H3Event, app: string, channel: string, config: ChannelConfig) {
	if (config.access === 'public') return
	const token = getHeader(event, 'x-neo-token')
	if (!token) throw createError({statusCode: 401, statusMessage: 'This channel requires an access token'})
	const entry = ownEntry(await accessIndex(), hashToken(token))
	if (!entry) throw createError({statusCode: 401, statusMessage: 'Unknown access token'})
	if (!entry.grants.some(grantValue => grantMatches(grantValue, app, channel)))
		throw createError({statusCode: 403, statusMessage: 'Token has no access to this channel'})
}
