# Prism

The CTRL Neo Studios website: Nuxt 4, Nuxt UI v4, Nuxt Content v3, Nuxt Studio (`/admin`).

```bash
bun install
bun run dev     # http://localhost:3000
bun run build
```

## Layout

- `content/` holds `projects/`, `articles/` and `gallery/` markdown (schemas live in `content.config.ts`).
- `public/wallpapers/` holds the V2 brand artwork. It's listed in `app/utils/site.ts` (`artworks`) and used as hero art, page banners and fallback covers.
- `app/utils/site.ts` also holds the project status badges, date formatting and the GitHub org link.
- Brand palette: `crimson` in `app/assets/css/main.css`, sampled from the V2 cube.
- The release backend for the studio's Tauri apps (update feeds, channels, downloads, CI publishing, admin UI) is the [`tauri-updater-backend`](https://github.com/CTRL-Neo-Studios/tauri-updater-backend) Nuxt module, configured under `tauriUpdater` in `nuxt.config.ts`: routes at `/apps`, admin at `/__updater-admin`. `.github/workflows/tauri-release.yml` forwards existing app repos to the module's release workflow. How-to: [docs/apps-release-guide.md](docs/apps-release-guide.md).

Copy `.env.example` to `.env` for local secrets. The `NUXT_TAURI_UPDATER_*` values are read at runtime only, so builds never contain them.
