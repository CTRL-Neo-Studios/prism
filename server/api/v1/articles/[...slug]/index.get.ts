export default eventHandler(async (event) => {
	const { slug } = getRouterParams(event)
	const page = await queryCollection(event, 'articles').path('/' + slug).first()
	// console.log(page)
	// console.log(slug)
	return page
})
