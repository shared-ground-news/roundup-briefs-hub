import { useState, useEffect } from "react";

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

// ── Global concurrency queue: max 4 og:image fetches at once ─────────────────
const MAX_CONCURRENT = 4;
let _active = 0;
const _queue: Array<() => void> = [];

function _schedule(task: () => void) {
  if (_active < MAX_CONCURRENT) {
    _active++;
    task();
  } else {
    _queue.push(task);
  }
}

function _done() {
  _active = Math.max(0, _active - 1);
  if (_queue.length > 0 && _active < MAX_CONCURRENT) {
    _active++;
    _queue.shift()!();
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export function useOgImage(articleUrl: string | null | undefined, skip: boolean): string | null {
  const [ogImage, setOgImage] = useState<string | null>(null);

  useEffect(() => {
    if (skip || !articleUrl) return;

    const cacheKey = `sg_og_${articleUrl}`;

    // Return cached value instantly — no queue needed
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { image, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setOgImage(image);
          return;
        }
      }
    } catch {}

    const controller = new AbortController();

    _schedule(() => {
      if (controller.signal.aborted) { _done(); return; }

      fetch(`/api/og-image?url=${encodeURIComponent(articleUrl)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then(({ image }: { image: string | null }) => {
          setOgImage(image);
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ image, ts: Date.now() }));
          } catch {}
        })
        .catch(() => {})
        .finally(() => _done());
    });

    return () => { controller.abort(); };
  }, [articleUrl, skip]);

  return ogImage;
}
