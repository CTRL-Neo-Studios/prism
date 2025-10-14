export default eventHandler(async (event) => {
	const { slug } = await readBody<{slug: string}>(event)
	const surround = await queryCollectionItemSurroundings(event, 'articles', '/' + slug, {
		fields: ['description']
	})
	return surround
})
