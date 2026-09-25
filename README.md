# Dominic Zaca — Media Kit

React + Vite + Tailwind single-page site, built as a single static HTML file (no backend/database required).

## Local development
```
npm install
npm run dev
```

## Build
```
npm run build
```
Outputs a single self-contained `dist/index.html` (assets inlined) thanks to `vite-plugin-singlefile`.

## Deploy to Netlify
**Option A — drag and drop (fastest, no git needed):**
1. Run `npm run build` locally
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder in — live in seconds

**Option B — connect this GitHub repo (auto-deploys on every push):**
1. Push this repo to GitHub (see below)
2. In Netlify: Add new site → Import an existing project → GitHub → select this repo
3. Build command: `npm run build` — Publish directory: `dist`
4. Deploy

## Push to GitHub
```
git init
git add .
git commit -m "Dominic Zaca media kit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
(Create the empty repo first at https://github.com/new)

## Note on Neon
This site has no database — the booking flow is a `mailto:` link (see `src/components/Booking.tsx`). Neon (Postgres) would only be needed if you later want booking enquiries saved to a database instead of opening an email client. Not required to go live.
