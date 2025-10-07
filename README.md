# Terminal Blog

A keyboard-first, terminal-inspired blog UI built with Next.js and exported as a fully static site. Posts are simple JSON files that can be served from `public/` or any static host/CDN, making deployment fast and low-maintenance.

- Keyboard-centric navigation (no mouse required)
- Fuzzy filtering with scoped search (title, tags, content)
- Lightweight command mode (":posts", ":help", ":quit")
- Static export (no backend needed) and hash-based routing for deep links
- Works behind a base path (e.g., on a subdirectory) and supports CDN asset prefixes

This repository contains:
- frontend/: The Next.js app (the blog UI)
- backend/: Placeholder (not used for static deployment)

---

## Features

- Keyboard navigation
  - List navigation: j/k or ↓/↑
  - Page jump: Ctrl+d / Ctrl+u
  - Open: Enter / l / →
  - Back: Esc / h / ← (from post/help)
  - Help: ?
  - Filter: /
  - Command mode: :
  - Quit to list: q
- Fuzzy filter with scopes
  - `title: keywords`, `tags: keywords`, `content: keywords`
  - No scope searches title, tags, and content
- Command mode (`:`)
  - `:posts` / `:p` — show posts
  - `:help` / `:h` — show help
  - `:quit` / `:q` — back to list
- Hash routing (deep links)
  - `#/` — list
  - `#/help` — help
  - `#/post/{id}` — open a post by id
- Static export to `out/` (no server required)
- Base path and asset prefix support for subdirectory hosting/CDNs

---

## Project structure

- frontend/
  - app/ — Next.js app entry
  - components/terminal.tsx — the terminal-style UI
  - lib/blog-data.tsx — fetches posts JSON files
  - public/ — public assets; place `posts/` here if serving locally
  - next.config.mjs — static export and base path/asset prefix wiring
  - scripts/preview.mjs — simple preview server for `out/` with base path support
- backend/
  - (empty; not required for static hosting)

---

## Getting started

Prerequisites:
- Node.js 20+ (recommended)
- npm

Install dependencies:
```
cd frontend
npm ci
```

Run in development:
```
npm run dev
```
The dev server runs at http://localhost:3000. During development, the app will try to load posts from `/posts/index.json`. You can either:
- Place posts in `frontend/public/posts`, or
- Point `NEXT_PUBLIC_POSTS_BASE` to an external posts URL.

---

## Posts format and loading

Posts are fetched client-side as JSON via `lib/blog-data.tsx`. By default the app expects:

- A directory `public/posts/`
- An `index.json` file listing filenames (array of strings)
- One JSON per post (filename referenced by `index.json`)

Example `public/posts/index.json`:
```json
[
  "001 - Building Terminal Interfaces in React.json",
  "002 - Improving Keyboard Navigation.json"
]
```

Example post JSON (BlogPost):
```json
{
  "id": 1,
  "title": "Building Terminal Interfaces in React",
  "date": "2024-06-30",
  "lastModified": "2025-01-15",
  "tags": ["react", "tui", "ux"],
  "content": "<p>This is <strong>HTML</strong> content. It will be rendered as-is.</p>"
}
```

Notes:
- `id` is optional; if omitted, it’s inferred from a numeric prefix in the filename (e.g., `001 ...` ➜ id 1).
- Sorting: posts are sorted by `lastModified` (if present) or `date` (both descending). Tie-breaker: `id` ascending.
- The content field is HTML and is inserted into the page. Ensure it is safe and sanitized if sourced from untrusted inputs.

Serving posts from another domain/CDN:
- Set `NEXT_PUBLIC_POSTS_BASE` to the base URL where `index.json` and post files live (e.g., `https://cdn.example.com/posts`).

Fetching concurrency:
- Adjust `NEXT_PUBLIC_POSTS_CONCURRENCY` (default 8).

---

## Build and export (static)

This project uses Next.js static export. Running the build will produce a fully static site in `frontend/out/`.

```
cd frontend
npm run build
```

Artifacts:
- `out/` — the static site export (HTML/CSS/JS)
- `out/_next/static/` — versioned static assets

---

## Preview the static export

Use the included preview server to test the contents of `out/` locally. It supports serving under a base path (subdirectory).

```
cd frontend
npm run preview
```

Defaults:
- Directory: `out/`
- Port: `5000`
- Base path: `/frontend`

You can override via CLI flags or environment variables:
```
node scripts/preview.mjs --dir out --port 5000 --base /my-base
# or
PREVIEW_DIR=out PREVIEW_PORT=5000 PREVIEW_BASE=/my-base npm run preview
```

Then open:
- http://localhost:5000/my-base/

---

## Configuration

Build-time environment variables (public):
- `NEXT_PUBLIC_BASE_PATH`
  - Sets Next.js `basePath` for subdirectory hosting.
  - Example: `/blog` ➜ app will be served at `https://example.com/blog/`
- `NEXT_PUBLIC_ASSET_PREFIX`
  - Sets Next.js `assetPrefix` (useful for CDN-hosted assets).
  - Example: `https://cdn.example.com`
- `NEXT_PUBLIC_POSTS_BASE`
  - Base URL for posts JSON files (`index.json` and individual post JSON files).
  - Default: in browser — `${window.location.origin}/posts`; during SSR/build — `/posts`
- `NEXT_PUBLIC_POSTS_CONCURRENCY`
  - Number of concurrent fetch “workers” for loading posts (default: `8`)

Preview server variables:
- `PREVIEW_DIR` (default: `out`)
- `PREVIEW_PORT` (default: `5000`)
- `PREVIEW_BASE` (default: `/frontend`)

---

## Deploying

Any static hosting environment will work (GitHub Pages, Netlify, Vercel static, S3/CloudFront, Nginx, etc.). The key is to upload `frontend/out/` and serve it under the desired base path.

Example: S3 + CloudFront

1) Build the static site:
```
cd frontend
npm ci
npm run build
```

2) Sync export to S3:
- Upload everything except `_next/` with short cache
- Upload `_next/static` with immutable long cache
```
aws s3 sync ./out "s3://YOUR_BUCKET" \
  --delete \
  --exclude "_next/*" \
  --cache-control "public, max-age=300, s-maxage=300"

if [ -d "./out/_next/static" ]; then
  aws s3 sync ./out/_next/static "s3://YOUR_BUCKET/_next/static" \
    --delete \
    --cache-control "public, max-age=31536000, immutable"
fi
```

3) Invalidate CloudFront HTML entry points (so new HTML is served immediately):
```
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/index.html" "/"
```

CI example:
- A GitHub Actions workflow can automate the above steps on push to main. Provide credentials via OIDC or static keys in repository secrets. See `.github/workflows/*` for a reference.

---

## Keyboard shortcuts

- Global
  - `?` — Show help
- List view
  - `j` / `↓` — Move down
  - `k` / `↑` — Move up
  - `g` — Top
  - `G` — Bottom
  - `Ctrl+d` — Page down
  - `Ctrl+u` — Page up
  - `Enter` / `l` / `→` — Open selected post
  - `/` — Filter posts
  - `:` — Command mode
- Post/Help view
  - `j` / `↓` — Scroll down
  - `k` / `↑` — Scroll up
  - `Esc` / `h` / `←` — Back to list
- Any non-list view
  - `q` — Return to list

---

## Tips

- Hosting under a subdirectory
  - Set `NEXT_PUBLIC_BASE_PATH` to the subdirectory (e.g., `/blog`) before `npm run build`.
  - Optionally set `NEXT_PUBLIC_ASSET_PREFIX` to your CDN.
  - Use the preview server with `--base /blog` to simulate the final URL structure locally.
- Serving posts from a CDN
  - Upload `posts/` (including `index.json`) to your CDN.
  - Set `NEXT_PUBLIC_POSTS_BASE=https://cdn.example.com/posts` before building or at runtime (it’s a public env var).

---

## Troubleshooting

- No posts appear
  - Check that `/posts/index.json` is reachable and returns an array of filenames.
  - Verify `NEXT_PUBLIC_POSTS_BASE` if posts are hosted elsewhere.
- 404s on subdirectory hosting
  - Ensure `NEXT_PUBLIC_BASE_PATH` was set at build time and the host serves files under that path.
  - Use the preview server’s `--base` to test.
- Assets not updating
  - Invalidate your CDN for HTML entry points.
  - `_next/static` is immutable; it gets new hashed URLs on each build.