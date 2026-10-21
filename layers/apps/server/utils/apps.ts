export interface ChannelConfig {
	/** public: anyone can read; restricted: needs an access token granting app:channel */
	access: 'public' | 'restricted'
	/** other channels whose releases this channel also offers; the newest wins */
	includes?: string[]
}

export interface AppConfig {
	/** GitHub repo allowed to publish releases (owner/name) */
	repo: string
	channels: Record<string, ChannelConfig>
}

/**
 * Every app the release backend serves. Kept in code on purpose: adding an app or channel is a reviewed PR,
 * never something Nuxt Studio content editors can change.
 */
export const appRegistry: Record<string, AppConfig> = {
	'neomap-editor': {
		repo: 'CTRL-Neo-Studios/neomap-editor',
		channels: {
			stable: {access: 'public'},
			beta: {access: 'public', includes: ['stable']},
			insider: {access: 'restricted', includes: ['beta', 'stable']},
			team: {access: 'restricted', includes: ['insider', 'beta', 'stable']}
		}
	}
}

/** Own-property lookup, so request input like "constructor" never resolves to Object.prototype members. */
export const ownEntry = <T>(record: Record<string, T> | undefined, key: string): T | undefined =>
	record && Object.hasOwn(record, key) ? record[key] : undefined

export function channelConfig(app: string, channel: string): ChannelConfig {
	const config = ownEntry(ownEntry(appRegistry, app)?.channels, channel)
	if (!config) throw createError({statusCode: 404, statusMessage: 'Unknown app or channel'})
	return config
}
