# Apps release service: prism's setup

Prism serves the studio's Tauri app updates with the [`tauri-updater-backend`](https://github.com/CTRL-Neo-Studios/tauri-updater-backend)
Nuxt module. Versioning, channels, access tokens, the admin UI and the release workflow are documented in the module's
README; this page covers only what is specific to prism.

> Always use `https://www.ctrl-neo.dev`. The bare `ctrl-neo.dev` redirects to `www`, and an updater following a
> cross-host redirect drops request headers, so restricted channels would fail.

## Where things are

| What | Where |
|---|---|
| Updater endpoint (baked into installed apps) | `https://www.ctrl-neo.dev/apps/updates/<app>/{{target}}/{{arch}}/{{current_version}}` |
| Admin UI: apps, channels, tokens, releases, cleanup | `https://www.ctrl-neo.dev/__updater-admin` |
| Config | `tauriUpdater` in `nuxt.config.ts` |
| Secrets | `NUXT_TAURI_UPDATER_*` runtime env vars, see `.env.example` |
| Metadata (apps, channels, users, releases) | external libSQL/Turso database (`NUXT_TAURI_UPDATER_DATABASE_OPTIONS_URL`) |
| Binaries | the studio's private S3 bucket, under `apps/<app>/<version>/` |

The database is external on purpose: a SQLite file inside the deployed project is wiped by every redeploy.

## Compatibility with apps already installed

Builds shipped before the module talk to prism exactly as before. `nuxt.config.ts` keeps the old contract:

| Setting | Value | Why |
|---|---|---|
| `prefix` | `/apps` | the updater URL is baked into installed apps |
| `headers` | `x-neo-channel`, `x-neo-token` | the header names installed apps send |
| `s3.keyPrefix` | `apps` | existing bundles stay where they are |
| `oidc.audience` | `ctrl-neo-apps` | what existing app CI requests |

Access tokens issued by the old `apps:access` CLI (`neo_…`) keep working: their hashes were imported unchanged.
New tokens from the admin UI look like `tu_…`.

## Publishing from an app repo

Existing app repos keep calling prism's workflow, which now forwards to the module's:

```yaml
jobs:
  release:
    uses: CTRL-Neo-Studios/prism/.github/workflows/tauri-release.yml@main
    with: {app: neogame-editor}
    secrets: inherit
    permissions: {contents: read, id-token: write}
```

New app repos can call the module's workflow directly:

```yaml
jobs:
  release:
    uses: CTRL-Neo-Studios/tauri-updater-backend/.github/workflows/tauri-release.yml@main
    with: {app: my-app, api: https://www.ctrl-neo.dev/apps, audience: ctrl-neo-apps}
    secrets: inherit
    permissions: {contents: read, id-token: write}
```

Register the app in the admin UI first: pick its GitHub repo and release branch (it lists the repo's branches as you
type). Its channels are managed there too. Only the workflows in
`tauriUpdater.oidc.allowedWorkflows` may publish. Both prism's and the module's are listed, until a real publish
confirms GitHub reports the module's file as `job_workflow_ref` for forwarded runs; then drop prism's entry.

## One-time migration from the old layer

The old `layers/apps` kept everything as JSON in the bucket. The module's import script copies it into the database
and checks every channel against its old pointer file:

```bash
# in the tauri-updater-backend repo, with prism's NUXT_TAURI_UPDATER_S3_* and _DATABASE_OPTIONS_URL exported
bun scripts/import-legacy.ts --registry registry.json --dry-run
bun scripts/import-legacy.ts --registry registry.json
```

`registry.json` is the old `appRegistry` from `apps.ts` as JSON. The script is safe to re-run and stops with
`MISMATCH` lines if a derived channel disagrees with its old pointer.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Everything 404s on `ctrl-neo.dev` | use `https://www.ctrl-neo.dev`; the bare domain redirects |
| Every updater route answers 503 *"Update database is not available"* | `NUXT_TAURI_UPDATER_DATABASE_OPTIONS_URL` unset or the database unreachable; check the server log |
| CI: 401 *"Only owner/repo on branch X, via an allowed release workflow, may publish"* | the run's repo or branch doesn't match the app's settings in the admin UI, or the workflow isn't in `allowedWorkflows` |
| CI: 401 *"Invalid GitHub Actions OIDC token"* | audience mismatch: the caller must request `ctrl-neo-apps` |
| Admin UI asks for a token and rejects it | `NUXT_TAURI_UPDATER_ADMIN_TOKEN` differs from what you pasted |
