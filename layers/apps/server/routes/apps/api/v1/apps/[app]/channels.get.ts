// Channels the caller may use: every public channel, plus restricted ones its X-Neo-Token grants. Feeds the app's channel picker.
export default defineEventHandler(async (event) => {
	const {app} = getRouterParams(event, {decode: true})
	const config = ownEntry(appRegistry, app!)
	if (!config) throw createError({statusCode: 404, statusMessage: 'Unknown app'})

	setResponseHeader(event, 'Cache-Control', 'private, no-store')
	const channels: {name: string, access: ChannelConfig['access']}[] = []
	for (const [name, channel] of Object.entries(config.channels)) {
		try {
			await assertChannelAccess(event, app!, name, channel)
			channels.push({name, access: channel.access})
		}
		catch (error) {
			if (!isError(error) || ![401, 403].includes(error.statusCode)) throw error
		}
	}
	return {channels}
})
