// CI only: registers a pending release and returns presigned upload URLs. Auth: GitHub Actions OIDC (see utils/oidc.ts).
export default defineEventHandler(async (event) => {
	const {app} = getRouterParams(event, {decode: true})
	const config = ownEntry(appRegistry, app!)
	if (!config) throw createError({statusCode: 404, statusMessage: 'Unknown app'})
	await assertPublisher(event, config)

	const body = startReleaseSchema.safeParse(await readBody(event))
	if (!body.success) throw createError({statusCode: 400, statusMessage: 'Invalid release', data: body.error.issues})

	setResponseStatus(event, 201)
	return await startRelease(app!, body.data)
})
