# Astro Static Blog Theme (reimu customization)

A static blog theme built with **Astro 5**. Its main idea: **every setting lives in one file** —
site info, navigation, colors, comments, analytics and feature flags are all in `src/config.ts`,
so you never have to dig through components.

> Based on [D-Sketon/astro-theme-reimu](https://github.com/D-Sketon/astro-theme-reimu),
> with a rebuilt config layer, several bug fixes and security hardening.
> MIT licensed — see [License & Credits](#license--credits).
>
> 中文文档见 [README.md](./README.md)。

---

## Features

- Markdown / MDX content with tags, categories, covers, excerpts
- Full-text search (fuse.js, index loaded lazily)
- KaTeX math, mermaid diagrams, Expressive Code highlighting
- PhotoSwipe lightbox, image gallery, lazy loading, image optimization
- Light / dark mode with colors driven by `src/config.ts`
- Seven comment systems: Valine, Waline, Gitalk, Giscus, Utterances, Twikoo, Disqus
- RSS, sitemap, archives, tag cloud, category cards, share buttons
- Pure static output — deploy anywhere

## Requirements

- **Node.js >= 22.12.0**
- **pnpm 9** (only `pnpm-lock.yaml` is provided; npm/yarn will not reproduce the dependency graph)

## Getting started

```bash
pnpm install
pnpm dev         # http://localhost:4321
pnpm build       # outputs to dist/
pnpm preview
pnpm lint
```

**Two things to change before anything else:**

1. `site` in `astro.config.mjs` — your real domain (used by sitemap, RSS, canonical URLs).
2. `site.title`, `site.author`, `sidebar.avatar`, `banner` in `src/config.ts`.

## Configuration

Everything is in `src/config.ts`:

```ts
site: {
  title: "My Blog",
  subtitle: "Notes on code and life",
  description: "An Astro static blog",
  author: "Your Name",
  language: "en",          // zh-cn / zh-tw / en / ja
},
```

**Colors** live in the `theme` section at the bottom of the same file and are compiled into
CSS variables by `src/utils/theme.ts` — no CSS editing required:

```ts
theme: {
  palette: {
    light: {
      "red-1": "#07bdff",   // primary: links, selection, loader
      "red-2": "#00bbff",   // primary variant
    },
    dark: {
      "red-0": "#07bdff",   // only override what differs from light
    },
  },
},
```

The `--red-N` naming is inherited from the upstream (originally a red theme);
semantically it is just the "primary color scale".

**Analytics** must be given an **ID string**, never `true` — `true` would be interpolated into the
script URL (`hm.js?true`) and silently collect nothing.

## Writing posts

Posts live in `src/content/blog/`; the filename becomes the URL:

```yaml
---
title: Post title
description: One-line summary for SEO and list pages
pubDate: 2024-01-01T09:00:00+08:00
tags: ["tag"]
categories: ["category"]
cover: "/images/cover-1.webp"
---
```

> Prefer a full timestamp **with a timezone offset**. A bare `2024-01-01` is parsed as UTC
> midnight and may render as the previous day on build machines in negative-offset zones.

Four sample posts are included (markdown syntax, MDX components, configuration) — delete them freely.

## Deployment

The build output in `dist/` is fully static.

- **Cloudflare Pages** — build `pnpm build`, output `dist`, rename `name` in `wrangler.jsonc`.
- **Tencent EdgeOne / ESA** — see `esa.jsonc`; keep the default 404 strategy. Setting
  `notFoundStrategy` to `singlePageApplication` makes every unknown path return the homepage
  with HTTP 200, so `404.astro` never applies.
- **CI** — `.github/workflows/build.yml` runs pnpm + Node 22/24, then lint and build.

> `scripts/ensure-ffi.sh` is only needed on some cloud builders. For supply-chain safety it
> **refuses to download an unverified native library by default**; pass its SHA-256 via the
> `CN_FONT_SPLIT_LIBFFI_SHA256` environment variable first.

## Security notes

- **Excerpt HTML is sanitized.** `src/utils/mdToExcerpt.ts` output is injected via
  `set:html` / `v-html`, so raw HTML is escaped, link protocols are allow-listed, and truncated
  tags are balanced. Do not remove these safeguards.
- **Avoid putting content strings into `define:vars`.** Astro < 6.1.6 is affected by
  [CVE-2026-41067](https://osv.dev/vulnerability/CVE-2026-41067) (incomplete `</script>`
  sanitization). Prefer `data-*` attributes; upgrading `astro` to **>= 6.1.6** is recommended.
- **No path traversal surface.** All dynamic routes are resolved at build time by `getStaticPaths`;
  there is no runtime filesystem access and no user-input-driven `fetch`.
- **Keep the lockfile in CI.** Use `pnpm install --frozen-lockfile`; `npm install` would ignore it.

## License & Credits

Based on [D-Sketon/astro-theme-reimu](https://github.com/D-Sketon/astro-theme-reimu).
**MIT License**, original copyright (c) 2024 D-Sketon — see [LICENSE](./LICENSE).

Font [LXGW WenKai Screen](https://github.com/lxgw/LxgwWenKai-Screen) is licensed under the
SIL Open Font License — see [OFL.txt](./OFL.txt).
