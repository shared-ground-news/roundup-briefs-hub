"""
backfill_images.py
──────────────────
One-time script: fetches og:image for all articles where image_url IS NULL
and writes the result back to Supabase.

Run on Render (or locally) where the server IP is NOT a Cloudflare datacenter
— major news sites block Cloudflare IPs but accept Render's IPs.

Usage:
    SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... python backfill_images.py

Optional env vars:
    BATCH_SIZE   — articles per Supabase query (default 100)
    TIMEOUT      — seconds to wait per og:image fetch (default 6)
"""

import os
import re
import time
import urllib.request
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
BATCH_SIZE   = int(os.environ.get("BATCH_SIZE", "100"))
TIMEOUT      = int(os.environ.get("TIMEOUT", "6"))

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_og_image(url: str) -> str | None:
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; SharedGroundBot/1.0)",
                "Accept": "text/html",
            },
        )
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            html = resp.read(50_000).decode("utf-8", errors="ignore")
        match = (
            re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
            or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.IGNORECASE)
        )
        return match.group(1) if match else None
    except Exception:
        return None


def run():
    offset     = 0
    total_done = 0
    total_set  = 0

    print("🖼  Starting image backfill...\n")

    # Check if image_url column exists first
    try:
        test = supabase.table("articles").select("id, image_url").limit(1).execute()
    except Exception as e:
        if "image_url" in str(e) and ("does not exist" in str(e) or "schema cache" in str(e)):
            print("❌  STOPP: Die Spalte 'image_url' existiert noch nicht in Supabase!")
            print()
            print("   Valeria muss im Supabase Dashboard → SQL Editor folgenden Befehl ausführen:")
            print()
            print("   ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url TEXT;")
            print()
            print("   Danach dieses Skript erneut ausführen.")
            return
        raise

    while True:
        # Fetch a batch of articles with no image_url
        resp = (
            supabase.table("articles")
            .select("id, link")
            .is_("image_url", "null")
            .range(offset, offset + BATCH_SIZE - 1)
            .execute()
        )
        rows = resp.data
        if not rows:
            break

        print(f"  Batch offset={offset}: {len(rows)} articles")

        for row in rows:
            article_id = row["id"]
            link       = row.get("link", "")
            if not link:
                continue

            image_url = fetch_og_image(link)
            if image_url:
                supabase.table("articles").update({"image_url": image_url}).eq("id", article_id).execute()
                total_set += 1
                print(f"    ✅  [{article_id}] {image_url[:80]}")
            else:
                print(f"    –   [{article_id}] no image found")

            total_done += 1
            time.sleep(0.2)  # be gentle — don't hammer news sites

        offset += BATCH_SIZE

    print(f"\n✅  Done. {total_done} articles checked, {total_set} images set.")


if __name__ == "__main__":
    run()
