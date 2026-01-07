// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: {enabled: true},
	css: ['~/assets/css/main.css'],
	modules: [
		'@nuxt/content',
		'@nuxt/image',
		'@nuxt/ui',
		'@nuxtjs/mdc',
		'nuxt-studio',
	],
	content: {
		preview: {
			api: 'https://api.nuxt.studio'
		}
	},
	studio: {
		repository: {
			provider: 'github',
			owner: 'CTRL-Neo-Studios',
			repo: 'prism',
			branch: 'dev',
			private: true
		},
		route: '/admin'
	}
})
