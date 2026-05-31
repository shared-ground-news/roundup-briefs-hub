export async function onRequest(context: { request: Request }) {
  const url = new URL(context.request.url).searchParams.get("url");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=604800",
  };

  if (!url) {
    return new Response(JSON.stringify({ image: null }), { headers });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SharedGroundBot/1.0)",
        Accept: "text/html",
      },
    } as RequestInit);

    const html = await res.text();

    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const image = match?.[1] ?? null;

    return new Response(JSON.stringify({ image }), { headers });
  } catch {
    return new Response(JSON.stringify({ image: null }), { headers });
  }
}
