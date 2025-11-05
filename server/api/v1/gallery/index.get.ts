export default defineEventHandler(async (event) => {
	return await queryCollection(event, 'gallery')
		.order('date', 'DESC')
		.all()
})

