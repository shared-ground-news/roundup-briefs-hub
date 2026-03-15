# German Scraper Setup & Verification

The scraper (`scraper_UPDATED.py`) already contains 13 DACH feeds with full German keyword matching. No code changes are needed — you just need to confirm it's running correctly on Render.

---

## Step 1 — Confirm the cron job is running on Render

1. Log in to [render.com](https://render.com)
2. Open your cron job / background worker
3. Verify the command is: `python scraper_UPDATED.py`
4. Verify the schedule is every 12 hours (e.g. `0 */12 * * *`)
5. Check the latest logs — you should see lines like:
   ```
   Fetching: https://www.spiegel.de/schlagzeilen/index.rss
   Fetching: https://www.zeit.de/index
   ...
   Saved X articles (locale=de)
   ```

---

## Step 2 — Confirm DATABASE_URL is set

In Render → your service → **Environment**:

| Variable | Should be |
|---|---|
| `DATABASE_URL` | postgres connection string pointing to your Postgres instance |

To check: in the Render shell, run:
```bash
python -c "import os; print(os.environ.get('DATABASE_URL', 'NOT SET'))"
```

---

## Step 3 — Check German articles in the database

Connect to your Postgres database and run:

```sql
SELECT locale, COUNT(*) FROM articles GROUP BY locale;
```

Expected output after the scraper has run:
```
 locale | count
--------+-------
 en     |  XXXX
 de     |   XXX
```

If `de` count is 0, the scraper hasn't run yet or there's an issue (see Step 4).

---

## Step 4 — Trigger a manual run

In Render → your cron job → **Manual Run** (or run via the shell):

```bash
python scraper_UPDATED.py
```

Watch the logs for any errors. Common issues:

- **`DATABASE_URL` not set** → add it in Render Environment
- **RSS feed timeout** → normal for some feeds, scraper will skip and continue
- **German articles not appearing** → check `GERMAN_FEEDS` list in `scraper_UPDATED.py`

---

## Step 5 — Verify on the frontend

1. Go to your site and switch to the **DE** locale (`/de`)
2. If German articles are loading, you're done ✓
3. If articles are missing, check the `locale` column in Postgres (Step 3)

---

## German feeds included in the scraper

| Publication | Type |
|---|---|
| Der Spiegel | General news (keyword-filtered) |
| Die Zeit | General news (keyword-filtered) |
| Süddeutsche Zeitung | General news (keyword-filtered) |
| taz | Progressive (keyword-filtered) |
| Der Tagesspiegel | General news (keyword-filtered) |
| Frankfurter Rundschau | General news (keyword-filtered) |
| t-online | General news (keyword-filtered) |
| n-tv | General news (keyword-filtered) |
| LSVD | LGBTQIA+ (all articles) |
| Queer.de | LGBTQIA+ (all articles) |
| noizz.de | Feminist/lifestyle (all articles) |
| Jacobin DE | Progressive investigative (keyword-filtered) |
| Analyse & Kritik | Progressive investigative (keyword-filtered) |

---

## Supabase table for contact form (run once)

If you haven't created the `contact_submissions` table yet, run this in **Supabase → SQL Editor**:

```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon insert" ON contact_submissions FOR INSERT WITH CHECK (true);
```

---

## Cloudflare Pages env vars needed (for contact form)

In Cloudflare Pages → your project → **Settings → Environment Variables**:

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key |

> **Note on Resend sender**: Until you add a verified domain in Resend, emails will come from `onboarding@resend.dev`. To send from a custom address, add your domain at resend.com/domains.
