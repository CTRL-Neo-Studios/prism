import type {BadgeProps} from '@nuxt/ui'

export const GITHUB_ORG = 'https://github.com/CTRL-Neo-Studios'

export const PROJECT_CARD_FIELDS = ['path', 'title', 'description', 'date', 'image', 'progress', 'repository'] as const

export const artworks = [
	{title: 'Ascii Singularity', src: '/wallpapers/[V2] CTRL Neo - Ascii Singularity - Light Text.png'},
	{title: 'Bitlines', src: '/wallpapers/[V2] CTRL Neo - Bitlines - Light Text.png'},
	{title: 'Ascii Matrix', src: '/wallpapers/[V2] CTRL Neo - Ascii Matrix - Light Text.png'},
	{title: 'Breathline Bokeh', src: '/wallpapers/[V2] CTRL Neo - Ascii Breathline Bokeh - Light Text.png'},
	{title: 'Fabric', src: '/wallpapers/[V2] CTRL Neo - Fabric - Light Text.png'}
]

/** Stable artwork fallback for content without a cover image. */
export function fallbackArt(key = '') {
	let h = 0
	for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0
	return artworks[Math.abs(h) % artworks.length]!.src
}

export const projectStatus: Record<string, {label: string, color: BadgeProps['color']}> = {
	release: {label: 'Release', color: 'success'},
	beta: {label: 'Beta', color: 'info'},
	alpha: {label: 'Alpha', color: 'warning'},
	concept: {label: 'Concept', color: 'neutral'}
}

export function formatDate(date?: string | Date) {
	return date ? new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) : ''
}
