// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
				compatibilityDate: '2025-07-15',
				devtools: {enabled: true},
				css: ['~/assets/css/main.css'],
				modules: ['@nuxt/content', '@nuxt/image', '@nuxt/ui', '@nuxtjs/mdc', 'nuxt-studio', '@vueuse/nuxt'],
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
												branch: 'main',
												private: true
								},
								route: '/admin'
				},
				hooks: {
								'components:extend': (components) => {
												const globals = components.filter(c => ['UButton', 'UIcon', 'UPageHero', 'UPageSection'].includes(c.pascalName))

												globals.forEach(c => c.global = true)
								}
				},
})