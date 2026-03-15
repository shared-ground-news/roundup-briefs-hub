export type Locale = "en" | "de";

export interface Translations {
  tagline: string;
  about: string;
  back: string;
  allTopics: string;
  today: string;
  dateTo: string;
  searchPlaceholder: string;
  allSources: string;
  sources: string;
  clearSelection: string;
  paywallAll: string;
  paywallFree: string;
  paywallOnly: string;
  clearAll: string;
  articles: string;
  article: string;
  noArticles: string;
  clearFilters: string;
  readFullArticle: string;
  updatedAt: string;
  paywallBadge: string;
  prevPage: string;
  nextPage: string;
  pageOf: string;
  serverWaking: string;
  seeAll: string;
  topics: Record<string, string>;
  // Newsletter + profile
  newsletter: string;
  getNewsletter: string;
  subscribeSuccess: string;
  chooseTopics: string;
  chooseLanguage: string;
  profile: string;
  followedTopics: string;
  noFollowedTopics: string;
  editPreferences: string;
  signOut: string;
  languageEnOnly: string;
  languageDeOnly: string;
  languageBoth: string;
  subscribeButton: string;
  skipForNow: string;
  savePreferences: string;
  newsletterIntro: string;
  onboardingTitle: string;
  onboardingIntro: string;
  // Date quick-select
  quickToday: string;
  quickYesterday: string;
  quickLastWeek: string;
  // Translate
  translateToEn: string;
  translateToDe: string;
  // Contact
  contactUs: string;
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  en: {
    tagline: "browse your news on your terms.",
    about: "about",
    back: "← back",
    allTopics: "All Topics",
    today: "today",
    dateTo: "to",
    searchPlaceholder: "search headlines…",
    allSources: "all sources",
    sources: "sources",
    clearSelection: "clear selection",
    paywallAll: "all",
    paywallFree: "🔓 free",
    paywallOnly: "🔒 paywalled",
    clearAll: "clear all",
    articles: "articles",
    article: "article",
    noArticles: "no articles match your filters.",
    clearFilters: "clear filters",
    readFullArticle: "read full article →",
    updatedAt: "updated",
    paywallBadge: "🔒",
    prevPage: "← previous",
    nextPage: "next →",
    pageOf: "of",
    serverWaking: "couldn't load articles. the server may be waking up — try refreshing.",
    seeAll: "see all",
    topics: {
      "All Topics":                              "All Topics",
      "Anti-Rights & Backlash Movements":        "Anti-Rights & Backlash",
      "Bodily Autonomy & Reproductive Justice":  "Bodily Autonomy & Reproductive Justice",
      "Violence, Safety & Criminal Justice":     "Violence, Safety & Justice",
      "State Power, Law & Governance":           "State Power, Law & Governance",
      "Economic & Labour Justice":               "Economic & Labour Justice",
      "Migration, Borders & Citizenship":        "Migration, Borders & Citizenship",
      "Climate & Environmental Justice":         "Climate & Environmental Justice",
      "Technology & Digital Power":              "Technology & Digital Power",
      "Culture, Media & Narrative Power":        "Culture, Media & Narrative",
    },
    newsletter: "newsletter",
    getNewsletter: "get the newsletter",
    subscribeSuccess: "you're in. the weekly digest is on its way.",
    chooseTopics: "choose topics",
    chooseLanguage: "choose language",
    profile: "profile",
    followedTopics: "followed topics",
    noFollowedTopics: "no topics followed yet.",
    editPreferences: "edit preferences",
    signOut: "sign out",
    languageEnOnly: "english only",
    languageDeOnly: "german only",
    languageBoth: "both",
    subscribeButton: "subscribe",
    skipForNow: "skip for now",
    savePreferences: "save",
    newsletterIntro: "cut through the noise. the week's essential stories, curated by topic, delivered once.",
    onboardingTitle: "tell us what moves you.",
    onboardingIntro: "pick the topics that matter to you — we'll filter the noise.",
    quickToday: "today",
    quickYesterday: "yesterday",
    quickLastWeek: "last 7 days",
    translateToEn: "translate to english",
    translateToDe: "auf deutsch lesen",
    contactUs: "contact us",
  },
  de: {
    tagline: "deine nachrichten, deine bedingungen.",
    about: "über uns",
    back: "← zurück",
    allTopics: "Alle Themen",
    today: "heute",
    dateTo: "bis",
    searchPlaceholder: "Schlagzeilen suchen…",
    allSources: "alle Quellen",
    sources: "Quellen",
    clearSelection: "Auswahl löschen",
    paywallAll: "alle",
    paywallFree: "🔓 kostenlos",
    paywallOnly: "🔒 paywall",
    clearAll: "alles löschen",
    articles: "Artikel",
    article: "Artikel",
    noArticles: "keine Artikel entsprechen deinen Filtern.",
    clearFilters: "Filter löschen",
    readFullArticle: "vollständigen Artikel lesen →",
    updatedAt: "aktualisiert",
    paywallBadge: "🔒",
    prevPage: "← zurück",
    nextPage: "weiter →",
    pageOf: "von",
    serverWaking: "Artikel konnten nicht geladen werden. Der Server startet möglicherweise — bitte neu laden.",
    seeAll: "alle anzeigen",
    topics: {
      "All Topics":                              "Alle Themen",
      "Anti-Rights & Backlash Movements":        "Anti-Rechte & Backlash",
      "Bodily Autonomy & Reproductive Justice":  "Körperliche Autonomie & Reproduktive Rechte",
      "Violence, Safety & Criminal Justice":     "Gewalt, Sicherheit & Strafjustiz",
      "State Power, Law & Governance":           "Staatsmacht, Recht & Regierung",
      "Economic & Labour Justice":               "Wirtschafts- & Arbeitsgerechtigkeit",
      "Migration, Borders & Citizenship":        "Migration, Grenzen & Staatsbürgerschaft",
      "Climate & Environmental Justice":         "Klima- & Umweltgerechtigkeit",
      "Technology & Digital Power":              "Technologie & Digitale Macht",
      "Culture, Media & Narrative Power":        "Kultur, Medien & Narrative Macht",
    },
    newsletter: "newsletter",
    getNewsletter: "newsletter abonnieren",
    subscribeSuccess: "dabei! der wöchentliche überblick kommt.",
    chooseTopics: "Themen wählen",
    chooseLanguage: "Sprache wählen",
    profile: "Profil",
    followedTopics: "verfolgte Themen",
    noFollowedTopics: "noch keine Themen verfolgt.",
    editPreferences: "Einstellungen bearbeiten",
    signOut: "abmelden",
    languageEnOnly: "nur englisch",
    languageDeOnly: "nur deutsch",
    languageBoth: "beide",
    subscribeButton: "abonnieren",
    skipForNow: "jetzt überspringen",
    savePreferences: "speichern",
    newsletterIntro: "das Wichtigste der Woche. nach Thema kuratiert, einmal geliefert.",
    onboardingTitle: "was bewegt dich?",
    onboardingIntro: "wähle Themen, die dir wichtig sind — wir filtern den Rest.",
    quickToday: "heute",
    quickYesterday: "gestern",
    quickLastWeek: "letzte 7 Tage",
    translateToEn: "auf englisch lesen",
    translateToDe: "auf deutsch lesen",
    contactUs: "kontakt",
  },
};
