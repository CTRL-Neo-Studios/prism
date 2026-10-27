// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2026-10-15',
	devtools: {enabled: true},
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/content', '@nuxt/image', '@nuxt/ui', '@nuxtjs/mdc', 'nuxt-studio', '@vueuse/nuxt', '@comark/nuxt', 'tauri-updater-backend'],
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
	// Release backend for the studio's Tauri apps. These values keep installed apps and the existing bucket working
	// unchanged; every secret (DB URL, S3 keys, admin token) is set at runtime by NUXT_TAURI_UPDATER_* env vars.
	tauriUpdater: {
		prefix: '/apps',
		database: {connector: 'postgresql'},
		s3: {keyPrefix: 'apps'},
		headers: {channel: 'x-neo-channel', token: 'x-neo-token'},
		oidc: {
			allowedWorkflows: [
				'CTRL-Neo-Studios/tauri-updater-backend/.github/workflows/tauri-release.yml@refs/heads/main'
			]
		}
	},
	hooks: {
		'components:extend': (components) => {
			const globals = components.filter(c => ['UButton', 'UIcon', 'UPageHero', 'UPageSection'].includes(c.pascalName))

			globals.forEach(c => c.global = true)
		}
	},
})
