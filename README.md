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
