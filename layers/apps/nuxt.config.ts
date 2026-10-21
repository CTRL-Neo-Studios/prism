// Release backend for the studio's Tauri apps (updater feeds, channels, downloads, CI publishing).
// Self-contained Nuxt layer: auto-registered from layers/, every route lives under /apps, so it can move into its own
// Nuxt service as-is. Every value is resolved at runtime from NUXT_APPS_* env vars, so builds never contain credentials.
export default defineNuxtConfig({
	runtimeConfig: {
		apps: {
			// GitHub Actions OIDC issuer; override (NUXT_APPS_OIDC_ISSUER) only for local tests
			oidcIssuer: 'https://token.actions.githubusercontent.com',
			s3: {
				endpoint: '',
				region: '',
				bucket: '',
				accessKeyId: '',
				secretAccessKey: ''
			}
		}
	}
})
