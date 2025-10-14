export function useArticles() {
	async function getAllArticles() {
		return await $fetch('/api/v1/articles')
	}

	async function getArticle(slug: string) {
		return await $fetch(`/api/v1/articles/${slug}`)
	}

	async function getArticleSurround(slug: string) {
		return await $fetch(`/api/v1/articles/surround`, {
			method: 'get',
			body: {
				slug: slug
			}
		})
	}

	async function toArticle(slug: string) {
		await navigateTo(`/articles/${slug}`)
	}

	return {
		getAllArticles,
		getArticle,
		getArticleSurround,
		toArticle
	}
}
