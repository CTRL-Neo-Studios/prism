import semver from 'semver'
import {releaseFileKey} from '#layers/apps/shared/model'

// Tauri updater endpoint: https://www.ctrl-neo.dev/apps/updates/<app>/{{target}}/{{arch}}/{{current_version}}
// Channel comes from the X-Neo-Channel header (default stable); restricted channels also need X-Neo-Token.
export default defineEventHandler(async (event) => {
	const {app, target, arch, current} = getRouterParams(event, {decode: true})
	if (!semver.valid(current)) throw createError({statusCode: 400, statusMessage: 'Invalid current version'})
	const platform = `${target}-${arch}`
	const channel = getHeader(event, 'x-neo-channel') || 'stable'

	// answers vary by token and carry presigned URLs, so nothing in between may cache them
	setResponseHeader(event, 'Cache-Control', 'no-store')
	const {release} = await findRelease(event, app!, channel, r => !!ownEntry(r.platforms, platform))
	const bundle = release && ownEntry(release.platforms, platform)
	if (!release || !bundle || !semver.gt(release.version, current!)) return sendNoContent(event)

	return {
		version: release.version,
		notes: release.notes ?? '',
		pub_date: release.pub_date,
		url: await useS3().presignGet(releaseFileKey(release.app, release.version, bundle.file)),
		signature: bundle.signature
	}
})
