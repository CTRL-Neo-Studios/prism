export function useArticles() {
	async function getAllArticles() {
		return await $fetch('/api/v1/articles', {
			method: 'get'
		})
	}

	async function getArticle(path: string) {
		return await $fetch(`/api/v1/articles/${path}`, {
			method: 'get'
		})
	}

	async function getArticleSurround(path: string) {
		return await $fetch(`/api/v1/articles/surround`, {
			method: 'get',
			body: {
				path: path
			}
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
