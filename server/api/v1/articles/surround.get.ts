export default defineEventHandler(async (event) => {
	const { path } = await readBody<{path: string}>(event)
	const surround = await queryCollectionItemSurroundings(event, 'articles', path, {
		fields: ['description']
	})
	return surround
})
