# FIFA World Cup 2026 — Live TV

A Next.js live TV app for watching FIFA World Cup 2026 streams from your M3U playlist. Built for easy deployment on [Vercel](https://vercel.com).

## Features

- **223+ sports channels** parsed from `fifa_world_cup_2026.m3u`
- **HLS video player** with cross-browser support (hls.js + native Safari)
- **Stream proxy** to handle CORS and mixed-content issues on HTTPS
- **Search & categories** — filter by ESPN, Fox, TUDN, Win Sports, Mundial, and more
- **Responsive UI** — works on desktop and mobile

## Quick Start

```bash
# Install dependencies
npm install

# Parse M3U playlist and start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Next.js — click **Deploy**

No environment variables required.

## How It Works

1. `scripts/parse-m3u.mjs` reads `fifa_world_cup_2026.m3u` and generates `src/data/channels.json`
2. The app loads channels and lets you pick a stream
3. `/api/proxy` fetches HLS playlists and segments server-side, rewriting URLs so the browser can play them over HTTPS

## Updating Channels

Edit `fifa_world_cup_2026.m3u`, then run:

```bash
npm run parse-m3u
```

Or rebuild — `npm run build` parses the M3U automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Parse M3U + production build |
| `npm run start` | Start production server |
| `npm run parse-m3u` | Regenerate channels from M3U |

## Notes

- Stream availability depends on the source providers and may change without notice.
- Some streams may not work due to geo-restrictions or expired URLs.
- This app proxies streams for playback convenience; ensure you have rights to access the content in your region.
