export default defineEventHandler(async (event) => {
	const { path } = getRouterParams(event)
	const page = await queryCollection(event, 'articles').path(path).first()
	return page
})
