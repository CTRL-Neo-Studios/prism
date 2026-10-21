// Manage who can use restricted channels: bun run apps:access <command> (reads NUXT_APPS_S3_* from .env).
import {randomBytes} from 'node:crypto'
import {setTimeout as sleep} from 'node:timers/promises'
import {parseArgs} from 'node:util'
import {ACCESS_FILE_KEY, accessFileSchema, grant, hashToken, slug} from '../shared/model'
import type {AccessFile} from '../shared/model'
import {createS3, S3ConflictError} from '../shared/s3'

const USAGE = `bun run apps:access <command>

  list                                   users and their grants
  add <user> [--grant app:channel]...    create a user, prints their token once
  grant <user> <app:channel>...          add grants ("*" matches any app or channel)
  revoke <user> <app:channel>...         remove grants
  rotate <user>                          replace the token, prints the new one once
  remove <user>                          delete the user

  --note <text>   with add: free-form note (who, why)

Changes reach the live site within 30 seconds.`

const s3 = createS3({
	endpoint: process.env.NUXT_APPS_S3_ENDPOINT ?? '',
	region: process.env.NUXT_APPS_S3_REGION ?? '',
	bucket: process.env.NUXT_APPS_S3_BUCKET ?? '',
	accessKeyId: process.env.NUXT_APPS_S3_ACCESS_KEY_ID ?? '',
	secretAccessKey: process.env.NUXT_APPS_S3_SECRET_ACCESS_KEY ?? ''
})

const newToken = () => `neo_${randomBytes(32).toString('base64url')}`

function fail(message: string): never {
	console.error(`error: ${message}`)
	process.exit(1)
}

function parse<T>(schema: {safeParse(value: unknown): {success: true, data: T} | {success: false}}, value: string | undefined, what: string): T {
	const result = schema.safeParse(value)
	if (!result.success) fail(`invalid ${what}: ${value ?? '(missing)'}`)
	return result.data
}

/**
 * Read, change one user, write back, then confirm the change stuck. The write is conditional (catches stale edits),
 * but megas4 doesn't enforce conditions atomically for simultaneous writes, so re-read after a pause and redo the
 * edit if another writer's copy replaced ours. Matters for revokes: a silently lost revoke would keep access open.
 */
async function update(user: string, change: (file: AccessFile) => void) {
	for (let attempt = 1; attempt <= 3; attempt++) {
		const stored = await s3.getJson(ACCESS_FILE_KEY, accessFileSchema)
		const file: AccessFile = stored?.data ?? {users: {}}
		change(file)
		const intended = JSON.stringify(file.users[user] ?? null)
		try {
			await s3.putJson(ACCESS_FILE_KEY, file, stored ? {ifMatch: stored.etag} : {ifNoneMatch: true})
		}
		catch (error) {
			if (!(error instanceof S3ConflictError)) throw error
			continue
		}
		await sleep(1500)
		const after = await s3.getJson(ACCESS_FILE_KEY, accessFileSchema)
		if (JSON.stringify(after?.data.users[user] ?? null) === intended) return
	}
	fail('someone else kept editing the access file at the same time; run the command again')
}

const userOf = (file: AccessFile, name: string) => Object.hasOwn(file.users, name) ? file.users[name]! : fail(`no user ${name}`)

const {positionals, values} = parseArgs({
	allowPositionals: true,
	options: {grant: {type: 'string', multiple: true}, note: {type: 'string'}}
})
const [command, rawUser, ...rest] = positionals

switch (command) {
	case 'list': {
		const users = Object.entries((await s3.getJson(ACCESS_FILE_KEY, accessFileSchema))?.data.users ?? {})
		if (!users.length) console.log('no users')
		for (const [name, entry] of users) console.log(`${name}\t${entry.grants.join(', ') || '(no grants)'}${entry.note ? `\t# ${entry.note}` : ''}`)
		break
	}
	case 'add': {
		const user = parse(slug, rawUser, 'user name')
		const grants = (values.grant ?? []).map(g => parse(grant, g, 'grant'))
		const token = newToken()
		const hashed = hashToken(token)
		await update(user, (file) => {
			// a retry may find our own earlier write: same token hash means it is ours, not a name clash
			if (Object.hasOwn(file.users, user) && file.users[user]!.token !== hashed) fail(`user ${user} already exists`)
			file.users[user] = {token: hashed, grants, ...(values.note ? {note: values.note} : {})}
		})
		console.log(`added ${user}. Token (shown once, give it to them):\n${token}`)
		break
	}
	case 'grant':
	case 'revoke': {
		const user = parse(slug, rawUser, 'user name')
		const changes = rest.map(g => parse(grant, g, 'grant'))
		if (!changes.length) fail(`${command} needs at least one app:channel`)
		await update(user, (file) => {
			const entry = userOf(file, user)
			entry.grants = command === 'grant'
				? [...new Set([...entry.grants, ...changes])]
				: entry.grants.filter(g => !changes.includes(g))
		})
		console.log(`${user}: ${command === 'grant' ? 'granted' : 'revoked'} ${changes.join(', ')}`)
		break
	}
	case 'rotate': {
		const user = parse(slug, rawUser, 'user name')
		const token = newToken()
		await update(user, (file) => {
			userOf(file, user).token = hashToken(token)
		})
		console.log(`rotated ${user}; the old token stops working within 30s. New token (shown once):\n${token}`)
		break
	}
	case 'remove': {
		const user = parse(slug, rawUser, 'user name')
		const current = await s3.getJson(ACCESS_FILE_KEY, accessFileSchema)
		if (!current || !Object.hasOwn(current.data.users, user)) fail(`no user ${user}`)
		await update(user, (file) => {
			// already gone on a retry is fine; only a name that never existed is an error
			if (!Object.hasOwn(file.users, user)) return
			delete file.users[user]
		})
		console.log(`removed ${user}`)
		break
	}
	default:
		console.log(USAGE)
		if (command && command !== 'help') process.exit(1)
}
