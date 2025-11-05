export default defineEventHandler(async (event) => {
    const { path } = await readBody<{path: string}>(event)
	const surround = await queryCollectionItemSurroundings(event, 'gallery', path, {
		fields: ['description']
	});
	return surround
})
