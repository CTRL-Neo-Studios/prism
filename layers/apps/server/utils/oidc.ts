import {createRemoteJWKSet, jwtVerify} from 'jose'
import type {RemoteJWKSet} from 'jose'
import type {H3Event} from 'h3'

/** CI requests its token for this audience, so tokens minted for other services (e.g. cloud logins) don't work here. */
export const OIDC_AUDIENCE = 'ctrl-neo-apps'
/** Only the studio's shared workflow on prism's main branch may publish; an app repo can't hand-roll a publish job. */
export const RELEASE_WORKFLOW = 'CTRL-Neo-Studios/prism/.github/workflows/tauri-release.yml@refs/heads/main'

let verifier: {issuer: string, jwks: RemoteJWKSet} | undefined

function useVerifier() {
	// issuer is configurable only so local tests can sign their own tokens; production uses GitHub's default
	const issuer = useRuntimeConfig().apps.oidcIssuer
	if (verifier?.issuer !== issuer) verifier = {issuer, jwks: createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks`))}
	return verifier
}

/** Claims of a verified GitHub Actions token. */
export interface PublisherClaims {
	repository: string
	runId: string
}

/**
 * Verifies the bearer token is a GitHub Actions OIDC token for this audience, minted in `app`'s registered repo,
 * on its main branch, by the shared release workflow. 401 on any failed check.
 */
export async function assertPublisher(event: H3Event, app: AppConfig): Promise<PublisherClaims> {
	const token = getHeader(event, 'authorization')?.match(/^Bearer (.+)$/)?.[1]
	if (!token) throw createError({statusCode: 401, statusMessage: 'Missing GitHub Actions OIDC token'})

	const {issuer, jwks} = useVerifier()
	let payload: Record<string, unknown>
	try {
		payload = (await jwtVerify(token, jwks, {issuer, audience: OIDC_AUDIENCE})).payload
	}
	catch {
		throw createError({statusCode: 401, statusMessage: 'Invalid GitHub Actions OIDC token'})
	}

	const ok = payload.repository === app.repo && payload.ref === 'refs/heads/main' && payload.job_workflow_ref === RELEASE_WORKFLOW
	if (!ok || typeof payload.run_id !== 'string')
		throw createError({statusCode: 401, statusMessage: `Only ${app.repo}@main via the shared release workflow may publish`})
	return {repository: app.repo, runId: payload.run_id}
}
