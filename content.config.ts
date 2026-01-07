import {defineContentConfig, defineCollection, z} from "@nuxt/content";

export const articleSchema = z.object({
	title: z.string(),
	tags: z.array(z.string()),
	image: z.string().editor({input: 'media'}).optional(),
	date: z.coerce.date(),
	author: z.string()
})

export const gallerySchema = z.object({
	title: z.string(),
	description: z.string(),
	category: z.string(),
	tags: z.array(z.string()),
	image: z.string().editor({input: 'media'}).optional(), // Image path relative to the /public directory
	date: z.coerce.date(),
	parameters: z.object({
		camera: z.string(),
		lens: z.string(),
		aperture: z.number(), // enter 4.5, will automatically be converted to f/4.5
		shutterSpeed: z.string()
	}),
	location: z.string()
})

export const projectSchema = z.object({
	title: z.string(),
	tags: z.array(z.string()),
	image: z.string().editor({input: 'media'}).optional(),
	date: z.coerce.date(),
	description: z.string(),
	progress: z.enum(['alpha', 'beta', 'release', 'concept']),
	repository: z.object({
		repoUsername: z.string(),
		repoName: z.string(),
		privateRepo: z.boolean().default(false),
		showIssues: z.boolean().default(true),
		showWiki: z.boolean().default(true),
		customWikiLink: z.string().url().optional()
	})
})

export default defineContentConfig({
	collections: {
		articles: defineCollection({
			type: 'page',
			source: 'articles/*.md',
			// Define custom schema for docs collection
			schema: articleSchema
		}),
		gallery: defineCollection({
			type: 'page',
			source: 'gallery/**',
			// Define custom schema for docs collection
			schema: gallerySchema
		}),
		projects: defineCollection({
			type: 'page',
			source: {
				include: 'projects/*.md',
				exclude: ['index.md']
			},
			// Define custom schema for docs collection
			schema: projectSchema,
		})
	}
})
