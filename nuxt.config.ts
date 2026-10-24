// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: {enabled: true},
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/content', '@nuxt/image', '@nuxt/ui', '@nuxtjs/mdc', 'nuxt-studio', '@vueuse/nuxt', '@comark/nuxt', 'tauri-updater-backend'],
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
	// Release backend for the studio's Tauri apps. These values keep installed apps and the existing bucket working
	// unchanged; every secret (DB URL, S3 keys, admin token) is set at runtime by NUXT_TAURI_UPDATER_* env vars.
	tauriUpdater: {
		prefix: '/apps',
		database: {connector: 'libsql'},
		s3: {keyPrefix: 'apps'},
		headers: {channel: 'x-neo-channel', token: 'x-neo-token'},
		oidc: {
			audience: 'ctrl-neo-apps',
			// prism's tauri-release.yml now forwards to the module's workflow, so GitHub should report the module's file as
			// job_workflow_ref. prism's own entry stays until a real publish confirms that, then drop it.
			allowedWorkflows: [
				'CTRL-Neo-Studios/tauri-updater-backend/.github/workflows/tauri-release.yml@refs/heads/main',
				'CTRL-Neo-Studios/prism/.github/workflows/tauri-release.yml@refs/heads/main'
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
