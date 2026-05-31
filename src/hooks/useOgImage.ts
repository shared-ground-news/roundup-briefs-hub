import { useState, useEffect } from "react";

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

export function useOgImage(articleUrl: string | null | undefined, skip: boolean): string | null {
  const [ogImage, setOgImage] = useState<string | null>(null);

  useEffect(() => {
    if (skip || !articleUrl) return;

    const cacheKey = `sg_og_${articleUrl}`;

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

    fetch(`/api/og-image?url=${encodeURIComponent(articleUrl)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(({ image }: { image: string | null }) => {
        setOgImage(image);
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ image, ts: Date.now() }));
        } catch {}
      })
      .catch(() => {});

    return () => controller.abort();
  }, [articleUrl, skip]);

  return ogImage;
}
