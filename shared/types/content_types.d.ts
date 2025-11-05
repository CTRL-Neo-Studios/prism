import {type articleSchema, gallerySchema} from "~~/content.config";

export type Article = Partial<z.infer<typeof articleSchema>>
export type Gallery = Partial<z.infer<typeof gallerySchema>>
