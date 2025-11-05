import type {Article} from "#shared/types/content_types";

export function useGallery() {

    async function getAllImages() {
        return await $fetch<Article[]>('/api/v1/gallery', {
			method: 'get'
		})
    }

    async function getGalleryImage(path: string) {
        return await $fetch<Article>(`/api/v1/gallery/${path}`, {
			method: 'get'
		})
    }

    async function getSurroundingImages(path: string) {
        return await $fetch<Article[]>(`/api/v1/gallery/surround`, {
            method: 'get',
            body: {
				path: path
            }
        })
    }

    async function toGalleryImage(path: string) {
        await navigateTo(`${path}`)
    }

    return {
		getAllImages,
		getGalleryImage,
		getSurroundingImages,
		toGalleryImage
    }

}
