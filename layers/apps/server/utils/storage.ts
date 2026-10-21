import {createS3, S3ConflictError} from '#layers/apps/shared/s3'
import type {S3Client} from '#layers/apps/shared/s3'

export {S3ConflictError}

let client: S3Client | undefined

/** The server's storage client, from NUXT_APPS_S3_* runtime config. Misconfiguration surfaces as 503, not a crash. */
export function useS3(): S3Client {
	if (client) return client
	try {
		client = createS3(useRuntimeConfig().apps.s3)
	}
	catch {
		throw createError({statusCode: 503, statusMessage: 'Release storage is not configured'})
	}
	return client
}
