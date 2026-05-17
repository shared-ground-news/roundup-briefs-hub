# shared ground — Claude Brain

## What is this project?
Feminist/LGBTQIA+ news aggregator available in English and German (and growing to more locales).
Built by **Valeria Pinto** (scraping, backend, data) and **Alexandra Brandl** (frontend, design, UX).

Live at: **sharedgroundnews.pages.dev** (will move to a custom domain)
GitHub: **https://github.com/shared-ground-news/roundup-briefs-hub**

---

## Who does what
| Person | Role | Focus |
|--------|------|-------|
| Valeria | Backend / data | Python scraper, RSS feeds, Postgres DB, Supabase schema |
| Alexandra (Alex) | Frontend / design | React components, UI/UX, styling, Tailwind |

When working with Claude: tell it who you are at the start of a session if you're working on your specific area.

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — component framework
- **Vite** — build tool (fast HMR, outputs to `dist/`)
- **Tailwind CSS** + **shadcn/ui** (Radix UI) — styling and component library
- **React Router v6** — client-side routing, multi-locale (`/de`, `/en`, `/at`, etc.)
- **TanStack React Query v5** — data fetching and caching
- **React Hook Form** + **Zod** — forms and validation

### Backend / Data
- **Python scraper** (`scraper_UPDATED.py`) — pulls ~30+ RSS feeds, keyword filtering, topic + identity tags, paywall detection
- **PostgreSQL on Render** — stores articles (accessed by the scraper)
- **Supabase** — user auth (magic link + Google OAuth) + user data (saves, follows, preferences)

### Hosting / Infrastructure
- **Cloudflare Pages** — hosts the React frontend, auto-deploys on push to `main`
  - Project name in Cloudflare: `sharedground`
  - Config: `wrangler.toml`
- **Render** — hosts the Python scraper and the articles Postgres DB

---

## Environment Variables
Copy `.env.example` to `.env.local` and fill in the values.

```
VITE_SUPABASE_URL=https://mhnjjstdayhkdwfxfxlv.supabase.co
VITE_SUPABASE_ANON_KEY   → get from Supabase → Settings → API Keys → Legacy → anon public
```

These are **build-time** variables (Vite bakes them in at build). They must also be set in Cloudflare Pages → Settings → Variables and Secrets → Production.

---

## Key Files

### Entry points
- `src/main.tsx` — React DOM render
- `src/App.tsx` — Router setup, AuthProvider wrapper, all routes

### Auth
- `src/contexts/AuthContext.tsx` — AuthProvider, `requireAuth()` pattern, onboarding trigger
- `src/hooks/useAuth.ts` — `useAuth()` hook (reads AuthContext)
- `src/components/AuthModal.tsx` — sign-in modal (magic link + Google)
- `src/components/OnboardingModal.tsx` — topic selection after first sign-in
- `src/lib/supabase.ts` — Supabase client (gracefully degrades if env vars missing)

### Article feed
- `src/pages/FeedPage.tsx` — main feed page, filters by locale/country
- `src/components/ArticleCard.tsx` — article card with bookmark button
- `src/components/BookmarkButton.tsx` — bookmark icon, calls `requireAuth()`
- `src/hooks/useSavedArticles.ts` — save/unsave logic via Supabase

### User pages
- `src/pages/SavedPage.tsx` — saved articles at `/de/saved`, `/en/saved`
- `src/pages/ProfilePage.tsx` — user profile

### Static pages
- `src/pages/ThemenPage.tsx` — topics overview (`/themen`)
- `src/pages/AnalysisPage.tsx` — analysis/charts (`/analyse`)
- `src/pages/NewsletterPage.tsx` — newsletter signup (`/newsletter`)
- `src/pages/UeberUnsPage.tsx` — about us (`/ueber-uns`)
- `src/components/ImprintPage.tsx` — legal imprint (Valeria Pinto & Alexandra Brandl)

### Config
- `wrangler.toml` — Cloudflare Pages config
- `vite.config.ts` — Vite config (PWA plugin lives here)
- `tailwind.config.ts` — Tailwind theme
- `src/lib/constants.ts` — topic slugs, shared constants

### Scraper
- `scraper/scraper_UPDATED.py` — Python scraper (Valeria's domain)
- `scraper/requirements.txt` — Python dependencies (runs on Render, not Cloudflare)

---

## Routes
```
/           → redirects to /de
/de         → German feed (main)
/en         → English feed (main)
/at /ch     → DACH country feeds
/es /it /us /cn /ug /fi /tr /ir /za /in  → international feeds
/themen     → topics page
/analyse    → analysis/charts
/newsletter → newsletter signup
/ueber-uns  → about us
/de/saved   → saved articles (auth required)
/en/saved   → saved articles (auth required)
```

---

## Supabase DB Schema (6 tables)
| Table | Purpose |
|-------|---------|
| `saved_articles` | Articles bookmarked by users (snapshot at save time) |
| `user_topic_preferences` | Topics a user follows (for personalised feed) |
| `users` (auth.users) | Managed by Supabase Auth |
| *(+ 3 more for Phase 2/3)* | Follows, digest preferences, digest logs |

---

## What's done (Phase 1)
- Supabase auth: magic link + Google OAuth
- Bookmark/save articles per user
- `requireAuth()` pattern: bookmark while logged out → modal → auto-saves after sign-in
- Saved articles pages (`/de/saved`, `/en/saved`)
- Onboarding modal after first sign-in (topic selection)
- Imprint listing Valeria Pinto & Alexandra Brandl
- 14 country/locale feeds
- Dark mode
- PWA-ready (manifest + service worker via `vite-plugin-pwa`)

---

## What's next

### Phase 2 — Topic follows
- "Follow" button on topic pills
- Personalised feed filtered to followed topics
- Onboarding screen improvements

### Phase 3 — Email digests
- Weekly/daily digest emails for followed topics
- Digest preferences screen (frequency, format)
- GitHub Actions cron job to send digests

### Longer term
- Capacitor wrap for App Store / Play Store

---

## Branch strategy
```
main          → production (Cloudflare auto-deploys on every push)
feature/xxx   → Valeria's feature branches
feature/yyy   → Alex's feature branches
```
Open a PR to `main` before merging. Review each other's PRs before merging.

---

## Dev setup (both Valeria and Alex)
```bash
git clone https://github.com/shared-ground-news/roundup-briefs-hub
cd roundup-briefs-hub
cp .env.example .env.local    # fill in Supabase values
npm install
npm run dev                   # runs on localhost:8080
```

---

## Cloudflare deployment
- Auto-deploys when code is pushed to `main`
- Build command: `npm run build`
- Output dir: `dist`
- Env vars must be set in Cloudflare Pages → Settings → Variables and Secrets → Production

---

## Notes for Claude
- The Supabase client in `src/lib/supabase.ts` gracefully degrades — the app loads even without env vars, but auth and saves are disabled.
- Auth is wrapped at the App level via `<AuthProvider>` in `src/App.tsx`.
- `requireAuth(callback)` is the pattern for any action that needs a logged-in user — it opens the sign-in modal and runs the callback after sign-in.
- Topic slugs are defined in `src/lib/constants.ts` — always use slugs, not raw labels, in the DB.
