export function useProjects() {
	async function getAllProjects() {
		return await queryCollection('projects')
			.order('date', 'DESC')
			.all()
	}

	async function getProjects(path: string) {
		return await queryCollection('projects').path(path).first()
	}

	async function getProjectSurround(path: string) {
		return queryCollectionItemSurroundings('projects', path, {
			fields: ['description']
		})
	}

	async function toProject(path: string) {
		await navigateTo(path)
	}

	return {
		getAllProjects,
		getProjects,
		getProjectSurround,
		toProject
	}
}
