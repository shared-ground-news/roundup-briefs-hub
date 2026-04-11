import { useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE, type Article, type Stats } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Filters {
  selectedTopics: string[];
  selectedSources: string[];
  timeRange: string | null;
  dateFrom: string;
  dateTo: string;
  search: string;
}

const defaultFilters: Filters = {
  selectedTopics: [],
  selectedSources: [],
  timeRange: null,
  dateFrom: "",
  dateTo: "",
  search: "",
};

// ─── Country → Locale mapping ─────────────────────────────────────────────────
// DACH countries map to the German feed; everything else to English.

const DACH_COUNTRIES = new Set(["Germany", "Austria", "Switzerland"]);

function countryToLocale(country?: string): "de" | "en" {
  if (!country) return "de";
  return DACH_COUNTRIES.has(country) ? "de" : "en";
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function dateStrDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hybrid useArticles hook.
 *
 * Accepts Alex's `country?` routing parameter, maps it to Valeria's locale
 * (DACH → "de", all others → "en"), and fetches from Valeria's API at
 * API_BASE/api/articles?locale=…
 *
 * Returns Alex's full interface so FeedPage and FilterBar need no changes.
 */
export function useArticles(country?: string) {
  const locale = countryToLocale(country);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderLoaded, setOlderLoaded] = useState(false);

  // ── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setOlderLoaded(false);
      setAllArticles([]);

      try {
        const [articlesRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/articles?locale=${locale}&limit=120`),
          fetch(`${API_BASE}/api/stats`),
        ]);

        if (!articlesRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch");
        }

        const articlesData = await articlesRes.json();
        const statsData = await statsRes.json();

        if (!cancelled) {
          setAllArticles(Array.isArray(articlesData) ? articlesData : []);
          setStats(statsData);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Artikel konnten nicht geladen werden. Der Server wacht möglicherweise gerade auf — bitte lade die Seite neu."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [locale]);

  // ── Load older articles (up to 3 months back) ────────────────────────────
  const loadOlderArticles = useCallback(async () => {
    if (olderLoaded || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const threeWeeksAgo = dateStrDaysAgo(21);
      const threeMonthsAgo = dateStrDaysAgo(90);
      const res = await fetch(
        `${API_BASE}/api/articles?locale=${locale}&limit=200&date_from=${threeMonthsAgo}&date_to=${threeWeeksAgo}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAllArticles((prev) => [...prev, ...(Array.isArray(data) ? data : [])]);
      setOlderLoaded(true);
    } catch {
      // silently ignore — user can retry by clicking the button again
    } finally {
      setLoadingOlder(false);
    }
  }, [locale, olderLoaded, loadingOlder]);

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
      filters.search !== "",
    [filters]
  );

  // ── Derived: filtered article list ───────────────────────────────────────
  const filteredArticles = useMemo(() => {
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

  const clearFilters = useCallback(() => setFilters(defaultFilters), []);

  return {
    articles: filteredArticles,
    allArticles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    sources,
    isFiltered,
    clearFilters,
    loadOlderArticles,
    loadingOlder,
    olderLoaded,
    hasOlderAvailable: !olderLoaded,
  };
}
