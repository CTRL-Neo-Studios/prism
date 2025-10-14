import {defineContentConfig, defineCollection} from "@nuxt/content";
import * as z from "zod";

export default defineContentConfig({
	collections: {
		articles: defineCollection({
			type: 'page',
			source: 'articles/*.md',
			// Define custom schema for docs collection
			schema: z.object({
				title: z.string(),
				tags: z.array(z.string()),
				image: z.string().optional(),
				date: z.coerce.date()
			})
		})
	}
})
