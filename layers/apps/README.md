# Apps release backend

Update feeds, channels, downloads and CI publishing for the studio's Tauri apps, at `https://www.ctrl-neo.dev/apps/…`.
A self-contained Nuxt layer: Nuxt auto-registers it from `layers/`, and every route lives under `/apps`, so it can
move into its own Nuxt service unchanged (copy this folder, the shared workflow and the `NUXT_APPS_*` env vars).

**Start with the guide:** [`docs/apps-release-guide.md`](../../docs/apps-release-guide.md) covers versioning, channels,
access tokens, onboarding a new app and reusing the service from other Nuxt projects. This README is the reference.

## Routes

| Route | For | Responses |
|---|---|---|
| `GET /apps/updates/:app/:target/:arch/:current` | Tauri updater (`{{target}}/{{arch}}/{{current_version}}`) | 200 manifest · 204 up to date · 401/403 restricted · 404 unknown app/channel |
| `GET /apps/download/:app/:platform?channel=` | website download buttons | 302 to a 15-min link · 404 |
| `GET /apps/api/v1/apps/:app/releases/latest?channel=` | version badges, download pages | release metadata, no URLs |
| `GET /apps/api/v1/apps/:app/channels` | the app's channel picker | public channels + those the token grants |
| `POST /apps/api/v1/apps/:app/releases` | CI | 201 pending release + upload URLs · 409 published or not newer |
| `POST /apps/api/v1/apps/:app/releases/:version/publish` | CI | 200 published · 422 uploads incomplete · 409 lost a race |

Clients pick a channel with the `X-Neo-Channel` header (updater) or `?channel=` (web), default `stable`. Restricted
channels also need `X-Neo-Token`. Custom headers on purpose: the updater resends its headers when downloading, and S3
rejects presigned URLs that also carry an `Authorization` header.

CI routes accept only a GitHub Actions OIDC token for audience `ctrl-neo-apps`, from the app's registered repo, on
`refs/heads/main`, minted by `CTRL-Neo-Studios/prism/.github/workflows/tauri-release.yml@refs/heads/main`.
No storage keys ever leave the server.

## Releasing an app

Bump `version` in the app's `src-tauri/tauri.conf.json` (strict semver: `1.2.0`, `1.3.0-beta.1`) and push to main. The
shared workflow builds Windows (NSIS), macOS (universal) and Linux (AppImage, best-effort), uploads straight to S3,
and publishes. Unchanged versions build but are skipped. The channel defaults to the prerelease tag
(`1.3.0-beta.1` → `beta`), else `stable`; a version must be newer than its channel's current release.

## Access to restricted channels

`apps/_access.json` holds users, token hashes and grants (`app:channel`, `*` matches anything). Manage it with the CLI;
it reads `NUXT_APPS_S3_*` from `.env`:

```bash
bun run apps:access add alice --grant neomap-editor:insider --note "QA"   # prints the token once
bun run apps:access grant alice '*:beta'
bun run apps:access revoke alice neomap-editor:insider
bun run apps:access rotate alice                                          # new token, old one stops working
bun run apps:access remove alice
bun run apps:access list
```

Changes apply within 30 s. Edits are conditional writes, so two people editing at once can't overwrite each other.

## Storage (private S3 bucket)

```
apps/_access.json                       users → token hash + grants
apps/<app>/channels/<channel>.json      current release of a channel (releaseSchema in shared/model.ts)
apps/<app>/<version>/release.json       every release, pending or published
apps/<app>/<version>/<file>             bundles, named <app>-<version>-<os><suffix>
```

Nothing is public; every download is a presigned URL issued after the channel check. Channel files and grants are
cached per server instance for 30 s.

## Configuration

Apps and channels live in `server/utils/apps.ts` (a reviewed PR adds one). A channel's `includes` lists channels it also
offers, and the newest version wins, so insiders move up to stable once it overtakes them.

Env vars (runtime only, see the root `.env.example`): `NUXT_APPS_S3_ENDPOINT`, `NUXT_APPS_S3_REGION`,
`NUXT_APPS_S3_BUCKET`, `NUXT_APPS_S3_ACCESS_KEY_ID`, `NUXT_APPS_S3_SECRET_ACCESS_KEY`.

## Code layout

- `shared/`: storage model (zod schemas, keys) and the S3 client; no Nitro imports, so scripts can use them.
- `server/utils/`: registry, access check, release lookup, OIDC check, publish flow.
- `scripts/access.ts`: the `apps:access` CLI. `scripts/release.ts`: collect + publish, run by the shared workflow.
