export default defineEventHandler(async (event) => {
    const { path } = getRouterParams(event)
	return await queryCollection(event, 'gallery').path(path).first()
})
