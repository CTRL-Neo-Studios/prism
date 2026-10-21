// Newest release on a channel (?channel=, default stable), without download URLs: for version badges and download pages.
export default defineEventHandler(async (event) => {
	const {app} = getRouterParams(event, {decode: true})
	const channel = String(getQuery(event).channel || 'stable')

	const {config, release} = await findRelease(event, app!, channel)
	setResponseHeader(event, 'Cache-Control', config.access === 'public' ? 'public, max-age=60' : 'private, no-store')
	if (!release) throw createError({statusCode: 404, statusMessage: 'No release on this channel yet'})

	return {
		app: release.app,
		version: release.version,
		channel: release.channel,
		notes: release.notes ?? '',
		pub_date: release.pub_date,
		platforms: Object.keys(release.platforms),
		installers: Object.keys(release.installers ?? {})
	}
})
