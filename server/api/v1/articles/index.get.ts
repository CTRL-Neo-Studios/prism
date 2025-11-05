export default defineEventHandler(async (event) => {
	return await queryCollection(event, 'articles').all()
})
