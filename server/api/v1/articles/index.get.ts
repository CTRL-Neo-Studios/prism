export default eventHandler(async (event) => {
	return await queryCollection(event, 'articles').all()
})
