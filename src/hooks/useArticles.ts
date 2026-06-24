import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { type Article, type Stats } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Filters {
  selectedTopics: string[];
  selectedSources: string[];
  timeRange: string | null;
  dateFrom: string;
  dateTo: string;
  search: string;
  freeOnly: boolean;
}

const defaultFilters: Filters = {
  selectedTopics: [],
  selectedSources: [],
  timeRange: null,
  dateFrom: "",
  dateTo: "",
  search: "",
  freeOnly: false,
};

// ─── Locale resolution ────────────────────────────────────────────────────────
// Accepts either a locale ("de" | "en") directly or a country name.
// DACH countries → German feed; everything else → English.

const DACH_COUNTRIES = new Set(["Germany", "Austria", "Switzerland"]);

function resolveLocale(localeOrCountry?: string): "de" | "en" {
  if (!localeOrCountry) return "de";
  if (localeOrCountry === "de") return "de";
  if (localeOrCountry === "en") return "en";
  return DACH_COUNTRIES.has(localeOrCountry) ? "de" : "en";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArticles(localeOrCountry?: string) {
  const locale = resolveLocale(localeOrCountry);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // ── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setAllArticles([]);

      try {
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("*")
          .eq("locale", locale)
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("scraped_at", { ascending: false })
          .limit(150);

        if (cancelled) return;
        if (fetchError) throw fetchError;

        setAllArticles((data as Article[]) ?? []);
      } catch {
        if (!cancelled) {
          setError("Couldn't load articles — please refresh the page.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // ── Derived: stats ───────────────────────────────────────────────────────
  const stats = useMemo<Stats | null>(() => {
    if (!allArticles.length) return null;
    return {
      total: allArticles.length,
      lgbtqia_plus: allArticles.filter((a) =>
        (a.tags || "").includes("lgbtqia+")
      ).length,
      women: allArticles.filter((a) => (a.tags || "").includes("women"))
        .length,
      last_scraped: allArticles[0]?.scraped_at ?? "",
    };
  }, [allArticles]);

  // ── Derived: unique sources list ─────────────────────────────────────────
  const sources = useMemo(() => {
    const s = new Set(allArticles.map((a) => a.source).filter(Boolean));
    return Array.from(s).sort();
  }, [allArticles]);

  // ── Derived: is any filter active? ───────────────────────────────────────
  const isFiltered = useMemo(
    () =>
      filters.selectedTopics.length > 0 ||
      filters.selectedSources.length > 0 ||
      filters.timeRange !== null ||
      filters.dateFrom !== "" ||
      filters.dateTo !== "" ||
      filters.search !== "" ||
      filters.freeOnly,
    [filters]
  );

  // ── Derived: filtered article list ───────────────────────────────────────
  const articles = useMemo(() => {
    return allArticles.filter((article) => {
      // Topic filter
      if (filters.selectedTopics.length > 0) {
        const articleTopics = (article.topics || "")
          .split(",")
          .map((t) => t.trim());
        if (!filters.selectedTopics.some((t) => articleTopics.includes(t))) {
          return false;
        }
      }

      // Source filter
      if (filters.selectedSources.length > 0) {
        if (!filters.selectedSources.includes(article.source)) return false;
      }

      // Free-only filter (hide paywalled articles)
      if (filters.freeOnly && article.is_paywalled === true) {
        return false;
      }

      // Time range filter
      const articleDate = new Date(article.published_at || article.scraped_at);
      if (filters.timeRange === "today") {
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        if (articleDate < startOfToday) return false;
      }

      // Date-from filter
      if (filters.dateFrom && articleDate < new Date(filters.dateFrom)) {
        return false;
      }

      // Date-to filter
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setDate(to.getDate() + 1);
        if (articleDate >= to) return false;
      }

      // Full-text search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const inTitle = (article.title || "").toLowerCase().includes(q);
        const inSummary = (article.summary || "").toLowerCase().includes(q);
        if (!inTitle && !inSummary) return false;
      }

      return true;
    });
  }, [allArticles, filters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    articles,
    allArticles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    sources,
    isFiltered,
    clearFilters,
  };
}

// ─── Country-specific on-demand fetcher (used by GlobalMap) ───────────────────
//
// When a user clicks a country on the world map, fetch up to 10 articles
// for that country from Supabase. Caches the last fetched country to avoid
// duplicate requests.

export function useCountryArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchForCountry = useCallback(async (country: string) => {
    if (lastFetched === country) return;
    setLastFetched(country);
    setArticles([]);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("country", country)
        .order("published_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [lastFetched]);

  const reset = useCallback(() => {
    setLastFetched(null);
    setArticles([]);
  }, []);

  return { articles, loading, fetchForCountry, reset };
}

// ─── Podcasts (static for now, can be moved to Supabase later) ────────────────

const STATIC_PODCASTS = [
  {
    feed_url: "lila-podcast",
    cover_url: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/bb/3a/77/bb3a77d2-d008-5893-89fc-5867ec9922e2/mza_16797203559299000238.jpeg/600x600bb.jpg",
    title: "Lila Podcast",
    description: "Feminismus für alle — intersektional, politisch, persönlich.",
    latest_ep: null,
    duration: null,
    website_url: "https://lila-podcast.de/",
  },
  {
    feed_url: "grosse-toechter",
    cover_url: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/80/e6/94/80e6947f-7584-5e57-d565-09be6214ea2d/mza_10762060924271713233.jpg/600x600bb.jpg",
    title: "Große Töchter",
    description: "Feministischer Talk über Körper, Gesellschaft und das Leben als Frau — aus Wien.",
    latest_ep: null,
    duration: null,
    website_url: "https://grossetoechter.simplecast.com/",
  },
  {
    feed_url: "feuer-und-brot",
    cover_url: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/64/72/9b/64729b20-c8f8-a88a-65e1-e420acda03e6/mza_3277642361547724290.jpg/600x600bb.jpg",
    title: "Feuer & Brot",
    description: "Alice Hasters und Maximiliane Haecke über Feminismus, Popkultur und Gesellschaft.",
    latest_ep: null,
    duration: null,
    website_url: "https://podcasts.apple.com/de/podcast/feuer-brot/id1546868381",
  },
  {
    feed_url: "queergestreift",
    cover_url: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/b2/bf/c7/b2bfc76a-9469-8325-0a45-99374bfad0b3/mza_12623188629185442526.jpg/600x600bb.jpg",
    title: "Queergestreift",
    description: "Queere Themen, Geschichten und Gespräche — für die LGBTQIA+-Community und alle, die zuhören wollen.",
    latest_ep: null,
    duration: null,
    website_url: "https://queergestreift.podigee.io/",
  },
  {
    feed_url: "diepodcastin",
    cover_url: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts114/v4/67/fb/e6/67fbe645-fde1-dc23-8164-04923b683825/mza_15518128877247076809.jpg/600x600bb.jpg",
    title: "DiePodcastin",
    description: "Feministisch, politisch, divers — Gespräche über Gleichstellung und gesellschaftliche Themen.",
    latest_ep: null,
    duration: null,
    website_url: "https://diepodcastin.de/",
  },
  {
    feed_url: "sophie-passmann",
    cover_url: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/6d/ef/47/6def47e5-b67a-781b-6c65-0662adea7a06/mza_7087549493904101574.jpg/600x600bb.jpg",
    title: "Der Sophie Passmann Podcast",
    description: "Sophie Passmann über Feminismus, Popkultur und die Absurditäten des Alltags.",
    latest_ep: null,
    duration: null,
    website_url: "https://podcasts.apple.com/de/podcast/der-sophie-passmann-podcast/id1539090263",
  },
];

export function usePodcasts() {
  return { podcasts: STATIC_PODCASTS, loading: false };
}
