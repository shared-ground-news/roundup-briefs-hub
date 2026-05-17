// ─── Article helpers (used by Vercel-style design components) ────────────────
//
// This file used to define API_BASE pointing at the Render Postgres backend.
// Since Valeria migrated articles to Supabase, the Render fetch is gone —
// articles now come from `useArticles` (which reads from Supabase directly).
//
// What remains here: pure helper functions for category mapping, paywall
// detection, and date formatting. These are used by the newspaper design
// components (FeaturedArticle, ArticleTile, ArticleCardSmall, etc.).

import { type Article, type Stats } from "./constants";

// Re-export so design components can `import { type Article } from "@/lib/api"`
export type { Article, Stats };

// ─── Topic mapping: backend key → 4 German display categories ─────────────────
// Categories: Politik | Kultur | Wirtschaft | Sport
const TOPIC_DISPLAY: Record<string, string> = {
  "Kultur & Medien":         "Kultur",
  "Sport":                   "Sport",
  "LGBTQIA+":                "Kultur",   // social/cultural identity
  "Lohnluecke & Wirtschaft": "Wirtschaft",
  "Arbeit & Wirtschaft":     "Wirtschaft",
  "Reproduktive Rechte":     "Politik",
  "Gewalt & Sicherheit":     "Politik",
  "Menschenrechte":          "Politik",
  "Gesundheit & Medizin":    "Politik",  // health policy
  "Migration & Asyl":        "Politik",
  "Recht & Politik":         "Politik",
  "Politik & Regierung":     "Politik",
};

export function mapTopic(backendTopic: string): string {
  return TOPIC_DISPLAY[backendTopic.trim()] ?? "Politik";
}

// Sport keywords — catches mis-tagged articles like Paralympics
const SPORT_TITLE_RE =
  /paralymp|olympia|olympisch|sportler\b|fußball|handball|basketball|tennis\b|volleyball|schwimm|leichtathletik|turnen\b|radsport|\bski\b|skifahren|snowboard|wintersport|formel\s*1|motorsport|boxen\b|ringen\b|triathlon|marathon\b|\bgolf\b|segeln\b|athleti/i;

export function getArticleCategory(article: Article): string {
  // Valeria's articles may already have a `category` field — prefer it if set
  if (article.category && article.category !== "general") return article.category;
  if (!article.topics) return "Politik";
  const topics = article.topics.split(",").map((t) => t.trim());

  if (topics.some((t) => TOPIC_DISPLAY[t] === "Sport")) return "Sport";
  if (SPORT_TITLE_RE.test(article.title + " " + (article.tags ?? ""))) return "Sport";
  return mapTopic(topics[0]);
}

export function getCategoryColor(
  category: string
): "blue" | "orange" | "magenta" {
  if (category === "Politik") return "blue";
  if (category === "Kultur") return "magenta";
  return "orange"; // Wirtschaft, Sport
}

// ─── Paywall detection ────────────────────────────────────────────────────────
const PAYWALLED_SOURCES = [
  "die presse", "faz", "nzz", "neue zürcher", "kleine zeitung",
  "süddeutsche", "sueddeutsche", "spiegel", "die zeit", "zeit online",
  "handelsblatt", "wirtschaftswoche", "die welt", "stern", "focus",
  "business insider",
];

export function isPaywalled(sourceOrArticle: string | Article): boolean {
  // Prefer article.is_paywalled if available (Valeria's scraper sets this)
  if (typeof sourceOrArticle !== "string") {
    if (sourceOrArticle.is_paywalled) return true;
    return isPaywalled(sourceOrArticle.source);
  }
  const s = sourceOrArticle.toLowerCase();
  return PAYWALLED_SOURCES.some((p) => s.includes(p));
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1d ago" : `${days}d ago`;
}

// ─── Fallback image ───────────────────────────────────────────────────────────
export const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&auto=format";

// ─── Country mappings ─────────────────────────────────────────────────────────
/** ISO 3-letter code → backend country query value */
export const ISO_TO_COUNTRY: Record<string, string> = {
  DEU: "Germany", AUT: "Austria", CHE: "Switzerland",
  USA: "United States", GBR: "United Kingdom", FRA: "France",
  ITA: "Italy", ESP: "Spain", FIN: "Finland", TUR: "Turkey",
  IRN: "Iran", ZAF: "South Africa", IND: "India", CHN: "China",
  UGA: "Uganda", BRA: "Brazil", NGA: "Nigeria", JPN: "Japan",
  AUS: "Australia", KEN: "Kenya", ARG: "Argentina", SWE: "Sweden",
  MEX: "Mexico", KOR: "South Korea",
};
