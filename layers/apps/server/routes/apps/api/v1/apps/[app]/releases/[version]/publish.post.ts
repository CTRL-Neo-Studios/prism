import semver from 'semver'

// CI only: verifies every upload and points the release's channel at it. Auth: GitHub Actions OIDC (see utils/oidc.ts).
export default defineEventHandler(async (event) => {
	const {app, version} = getRouterParams(event, {decode: true})
	const config = ownEntry(appRegistry, app!)
	if (!config) throw createError({statusCode: 404, statusMessage: 'Unknown app'})
	await assertPublisher(event, config)
	if (semver.valid(version) !== version) throw createError({statusCode: 400, statusMessage: 'Invalid version'})

	return await publishRelease(app!, version!)
})
