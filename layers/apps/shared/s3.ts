import {AwsClient} from 'aws4fetch'
import type {z} from 'zod/v4'

export interface S3Settings {
	endpoint: string
	region: string
	bucket: string
	accessKeyId: string
	secretAccessKey: string
}

/** Stored JSON plus its ETag, so a later write can require that nobody changed it in between. */
export interface Versioned<T> {
	data: T
	etag: string
}

/** Thrown when a conditional write loses a race (S3 412). */
export class S3ConflictError extends Error {}

/** Write preconditions: `ifMatch` = ETag read earlier (fails if changed since), `ifNoneMatch` = create only. */
export interface WriteCondition {
	ifMatch?: string
	ifNoneMatch?: true
}

export interface S3Client {
	/** Schema-validated JSON with its ETag, or null when missing. Storage content is external input. */
	getJson<T extends z.ZodType>(key: string, schema: T): Promise<Versioned<z.infer<T>> | null>
	/** Writes JSON; losing a WriteCondition race throws S3ConflictError instead of silently overwriting. */
	putJson(key: string, value: unknown, condition?: WriteCondition): Promise<void>
	/** Object size in bytes, or null when missing. */
	size(key: string): Promise<number | null>
	delete(key: string): Promise<void>
	/** Time-limited links for private objects; the bucket itself is never public. */
	presignGet(key: string, expiresInSeconds?: number): Promise<string>
	presignPut(key: string, expiresInSeconds?: number): Promise<string>
}

/** Minimal S3 client over aws4fetch; used by the server (runtime config) and the apps:access script (env). */
export function createS3(settings: S3Settings): S3Client {
	const {endpoint, region, bucket, accessKeyId, secretAccessKey} = settings
	if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) throw new Error('Release storage is not configured')
	const aws = new AwsClient({accessKeyId, secretAccessKey, region: region || 'auto', service: 's3'})
	// path-style URLs: work with any self-hosted S3, no wildcard DNS needed
	const base = `${endpoint.replace(/\/+$/, '')}/${bucket}`
	const objectUrl = (key: string) => `${base}/${key.split('/').map(encodeURIComponent).join('/')}`

	async function presign(method: 'GET' | 'PUT', key: string, expiresInSeconds: number) {
		const url = new URL(objectUrl(key))
		url.searchParams.set('X-Amz-Expires', String(expiresInSeconds))
		return (await aws.sign(url.toString(), {method, aws: {signQuery: true}})).url
	}

	return {
		async getJson(key, schema) {
			const res = await aws.fetch(objectUrl(key))
			if (res.status === 404) return null
			if (!res.ok) throw new Error(`S3 read ${key} failed (${res.status})`)
			const parsed = schema.safeParse(await res.json())
			if (!parsed.success) throw new Error(`Malformed JSON at ${key}`)
			return {data: parsed.data, etag: res.headers.get('etag') ?? ''}
		},

		async putJson(key, value, condition: WriteCondition = {}) {
			const headers: Record<string, string> = {'content-type': 'application/json'}
			if (condition.ifMatch) headers['if-match'] = condition.ifMatch
			if (condition.ifNoneMatch) headers['if-none-match'] = '*'
			const res = await aws.fetch(objectUrl(key), {method: 'PUT', body: JSON.stringify(value, null, '\t'), headers})
			if (res.status === 412) throw new S3ConflictError(`${key} was changed concurrently`)
			if (!res.ok) throw new Error(`S3 write ${key} failed (${res.status})`)
		},

		async size(key) {
			const res = await aws.fetch(objectUrl(key), {method: 'HEAD'})
			if (res.status === 404) return null
			if (!res.ok) throw new Error(`S3 head ${key} failed (${res.status})`)
			return Number(res.headers.get('content-length'))
		},

		async delete(key) {
			const res = await aws.fetch(objectUrl(key), {method: 'DELETE'})
			if (!res.ok && res.status !== 404) throw new Error(`S3 delete ${key} failed (${res.status})`)
		},

		presignGet: (key, expiresInSeconds = 900) => presign('GET', key, expiresInSeconds),
		presignPut: (key, expiresInSeconds = 3600) => presign('PUT', key, expiresInSeconds)
	}
}
