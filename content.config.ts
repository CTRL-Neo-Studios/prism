import {defineContentConfig, defineCollection} from "@nuxt/content";
import * as z from "zod";

export const articleSchema = z.object({
	title: z.string(),
	tags: z.array(z.string()),
	image: z.string().optional(),
	date: z.coerce.date()
})

export const gallerySchema = z.object({
	title: z.string(),
	description: z.string(),
	category: z.string(),
	tags: z.array(z.string()),
	image: z.string().optional(), // Image path relative to the /public directory
	date: z.coerce.date(),
	parameters: z.object({
		camera: z.string(),
		lens: z.string(),
		aperture: z.number(), // enter 4.5, will automatically be converted to f/4.5
		shutterSpeed: z.string()
	}),
	location: z.string()
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
			source: 'gallery/*.yml',
			// Define custom schema for docs collection
			schema: gallerySchema
		})
	}
})
