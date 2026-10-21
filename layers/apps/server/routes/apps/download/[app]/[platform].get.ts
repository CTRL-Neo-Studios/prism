import {releaseFileKey} from '#layers/apps/shared/model'

// First-install download for website buttons: 302 to a short-lived link for the newest installer.
// ?channel= selects a channel (default stable); browsers send no token, so only public channels work here.
export default defineEventHandler(async (event) => {
	const {app, platform} = getRouterParams(event, {decode: true})
	const channel = String(getQuery(event).channel || 'stable')

	setResponseHeader(event, 'Cache-Control', 'no-store')
	const {release} = await findRelease(event, app!, channel, r => !!ownEntry(r.installers, platform!))
	const installer = release && ownEntry(release.installers, platform!)
	if (!release || !installer) throw createError({statusCode: 404, statusMessage: 'No installer for this platform'})

	return sendRedirect(event, await useS3().presignGet(releaseFileKey(release.app, release.version, installer.file)), 302)
})
