export type Locale = "en" | "de";

export interface Article {
  id: number;
  title: string;
  link: string;
  summary: string;
  source: string;
  country: string;
  category: string;
  tags: string;
  topics: string;
  scraped_at: string;
  published_at?: string;
  is_paywalled?: boolean;
  locale?: string;
  image_url?: string | null;
}

export interface Stats {
  total: number;
  lgbtqia_plus: number;
  women: number;
  last_scraped: string;
}

export const TOPICS = [
  { label: "All Topics",             emoji: "✨" },
  { label: "Reproductive Rights",    emoji: "🩺" },
  { label: "Gender Pay Gap",         emoji: "💰" },
  { label: "LGBTQIA+",               emoji: "🏳️‍🌈" },
  { label: "Immigration",            emoji: "🌍" },
  { label: "Human Rights",           emoji: "⚖️" },
  { label: "Health & Medicine",      emoji: "🏥" },
  { label: "Law & Policy",           emoji: "📜" },
  { label: "Politics & Government",  emoji: "🏛️" },
  { label: "Culture & Media",        emoji: "🎭" },
  { label: "Sports",                 emoji: "⚽" },
  { label: "Violence & Safety",      emoji: "🛡️" },
  { label: "Workplace & Economics",  emoji: "💼" },
] as const;

export const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Reproductive Rights":    { bg: "#FFE5EF", text: "#C8003C", border: "#F0ADC8" },
  "Gender Pay Gap":         { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  "LGBTQIA+":               { bg: "#EDE7F6", text: "#4A1FA8", border: "#B39DDB" },
  "Immigration":            { bg: "#E0F7FA", text: "#006064", border: "#80DEEA" },
  "Human Rights":           { bg: "#FFEBEE", text: "#B71C1C", border: "#EF9A9A" },
  "Health & Medicine":      { bg: "#E8F5E9", text: "#1B5E20", border: "#A5D6A7" },
  "Law & Policy":           { bg: "#F3E5F5", text: "#4A148C", border: "#CE93D8" },
  "Politics & Government":  { bg: "#E3F2FD", text: "#0D47A1", border: "#90CAF9" },
  "Culture & Media":        { bg: "#FFF8E1", text: "#E65100", border: "#FFD54F" },
  "Sports":                 { bg: "#E8F5E9", text: "#2E7D32", border: "#81C784" },
  "Violence & Safety":      { bg: "#FFEBEE", text: "#C62828", border: "#EF9A9A" },
  "Workplace & Economics":  { bg: "#ECEFF1", text: "#37474F", border: "#B0BEC5" },
};

export const LGBTQIA_SOURCES = new Set([
  "Gay Times", "PinkNews", "Out Magazine", "LGBTQ Nation", "Advocate",
  "Autostraddle", "Them", "Queerty", "Xtra Magazine",
]);

export const FEMINIST_SOURCES = new Set([
  "Ms. Magazine", "Feministing", "Jezebel", "Refinery29 Feminism",
  "The Guardian Women", "The Funambulist",
]);

export function getSourceBorderColor(source: string): string {
  if (LGBTQIA_SOURCES.has(source)) return "#4A1FA8";
  if (FEMINIST_SOURCES.has(source)) return "#D4006A";
  return "#C8C4BA";
}

// ── Source registries per locale ─────────────────────────────────────────────

export const EN_SOURCES: string[] = [
  "ABC News", "Accuracy in Media", "Advocate", "Al Jazeera", "AlterNet",
  "Associated Press", "Autostraddle", "BBC News", "BBC News World",
  "CBC News World", "CNN World", "Democracy Now", "Fair Observer",
  "Feministing", "Financial Times", "FSRN", "Gay Times", "Global Voices",
  "HuffPost", "IPS News Agency", "Jezebel", "Jewish Voice for Peace",
  "Le Monde", "Le Monde Diplomatique", "LGBTQ Nation", "Media Matters",
  "Ms. Magazine", "New York Times", "NPR News", "Out Magazine", "PinkNews",
  "Queerty", "Refinery29 Feminism", "Reveal News", "Reuters", "Reuters World",
  "SBS News World", "The Conversation", "The Funambulist", "The Guardian",
  "The Guardian Women", "The Independent", "The Progressive", "Them",
  "Washington Post", "Xtra Magazine",
];

// German sources — keyword-filtered unless marked specialist
export const DE_SOURCES: string[] = [
  // General / quality news (keyword-filtered)
  "tagesschau.de", "Der Spiegel", "Die Zeit", "Süddeutsche Zeitung",
  "taz", "Deutsche Welle Deutsch", "Deutschlandfunk",
  // Investigative / progressive (all articles included)
  "CORRECTIV", "netzpolitik.org",
  // DACH expansion (keyword-filtered)
  "Der Standard", "ORF.at",
  // LGBTQIA+ specialist (all articles included)
  "queer.de",
  // Feminist specialist (all articles included)
  "Missy Magazine",
];

export const SOURCES_BY_LOCALE: Record<Locale, string[]> = {
  en: EN_SOURCES,
  de: DE_SOURCES,
};

// ── Topic slug ↔ label map ───────────────────────────────────────────────────
// Slugs are stable DB keys; labels are display text per locale.
export const TOPIC_SLUGS: Record<string, { en: string; de: string; emoji: string }> = {
  reproductive_rights:  { en: "Reproductive Rights",    de: "Reproduktive Rechte",      emoji: "🩺" },
  gender_pay_gap:       { en: "Gender Pay Gap",         de: "Gender Pay Gap",           emoji: "💰" },
  lgbtqia_plus:         { en: "LGBTQIA+",               de: "LGBTQIA+",                 emoji: "🏳️‍🌈" },
  immigration:          { en: "Immigration",            de: "Migration",                emoji: "🌍" },
  human_rights:         { en: "Human Rights",           de: "Menschenrechte",           emoji: "⚖️" },
  health_medicine:      { en: "Health & Medicine",      de: "Gesundheit & Medizin",     emoji: "🏥" },
  law_policy:           { en: "Law & Policy",           de: "Recht & Politik",          emoji: "📜" },
  politics_government:  { en: "Politics & Government",  de: "Politik & Regierung",      emoji: "🏛️" },
  culture_media:        { en: "Culture & Media",        de: "Kultur & Medien",          emoji: "🎭" },
  sports:               { en: "Sports",                 de: "Sport",                   emoji: "⚽" },
  violence_safety:      { en: "Violence & Safety",      de: "Gewalt & Sicherheit",      emoji: "🛡️" },
  workplace_economics:  { en: "Workplace & Economics",  de: "Arbeit & Wirtschaft",      emoji: "💼" },
};

