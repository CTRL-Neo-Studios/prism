export function useArticles() {
	async function getAllArticles() {
		return await queryCollection('articles')
			.order('date', 'DESC')
			.all()
	}

	async function getArticle(path: string) {
		return await queryCollection('articles').path(path).first()
	}

	async function getArticleSurround(path: string) {
		return queryCollectionItemSurroundings('articles', path, {
			fields: ['description']
		})
	}

	async function toArticle(path: string) {
		await navigateTo(path)
	}

	return {
		getAllArticles,
		getArticle,
		getArticleSurround,
		toArticle
	}
}
