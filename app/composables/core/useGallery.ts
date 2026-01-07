import type {Article} from "#shared/types/content_types";

export function useGallery() {

    async function getAllImages() {
        return await queryCollection('gallery')
			.order('date', 'DESC')
			.all()
    }

    async function getGalleryImage(path: string) {
        return await queryCollection('gallery').path(path).first()
    }

    async function getSurroundingImages(path: string) {
        return queryCollectionItemSurroundings('gallery', path, {
			fields: ['description']
		});
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
