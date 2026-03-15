import { useCallback, useEffect, useRef, useState } from "react";
import { TOPICS, TOPIC_SLUGS, type Locale } from "@/lib/constants";
import { type Filters, type PaywallFilter } from "@/hooks/useArticles";
import { type Translations } from "@/lib/translations";
import { Search, X, ChevronDown, Check, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFollowedTopics } from "@/hooks/useFollowedTopics";

// Build a reverse map: English label → slug
const LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(TOPIC_SLUGS).map(([slug, info]) => [info.en, slug])
);

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  localeSources: string[];  // locale-specific source list from SOURCES_BY_LOCALE
  articleCount: number;
  totalCount: number;
  isFiltered: boolean;
  clearFilters: () => void;
  locale: Locale;
  t: Translations;
}

const FilterBar = ({
  filters,
  setFilters,
  localeSources,
  articleCount,
  totalCount,
  isFiltered,
  clearFilters,
  t,
}: FilterBarProps) => {
  const { user } = useAuth();
  const { isFollowing, followTopic, unfollowTopic } = useFollowedTopics();
  const [searchInput, setSearchInput] = useState(filters.search);
  const [sourceOpen, setSourceOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const sourceRef = useRef<HTMLDivElement>(null);

  // Sync searchInput when filters are cleared externally
  useEffect(() => {
    if (filters.search === "" && searchInput !== "") {
      setSearchInput("");
    }
  }, [filters.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, setFilters]);

  // Close source dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setSourceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTopic = useCallback(
    (label: string) => {
      setFilters((f) => {
        if (label === "All Topics") return { ...f, selectedTopics: [] };
        const next = f.selectedTopics.includes(label)
          ? f.selectedTopics.filter((t) => t !== label)
          : [...f.selectedTopics, label];
        return { ...f, selectedTopics: next };
      });
    },
    [setFilters]
  );

  const toggleSource = useCallback(
    (s: string) => {
      setFilters((f) => {
        const next = f.selectedSources.includes(s)
          ? f.selectedSources.filter((x) => x !== s)
          : [...f.selectedSources, s];
        return { ...f, selectedSources: next };
      });
    },
    [setFilters]
  );

  const clearSources = useCallback(
    () => setFilters((f) => ({ ...f, selectedSources: [] })),
    [setFilters]
  );

  const setPaywall = useCallback(
    (v: PaywallFilter) => setFilters((f) => ({ ...f, paywallFilter: v })),
    [setFilters]
  );

  const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

  const todayStr = toIsoDate(new Date());
  const thirtyDaysAgoStr = toIsoDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  const selectQuickDate = useCallback((from: string, to: string) => {
    setFilters((f) => ({ ...f, dateFrom: from, dateTo: to, timeRange: null }));
  }, [setFilters]);

  const setDateFrom = useCallback(
    (v: string) => setFilters((f) => ({ ...f, dateFrom: v, timeRange: null })),
    [setFilters]
  );
  const setDateTo = useCallback(
    (v: string) => setFilters((f) => ({ ...f, dateTo: v, timeRange: null })),
    [setFilters]
  );
  const clearDates = useCallback(
    () => setFilters((f) => ({ ...f, dateFrom: "", dateTo: "", timeRange: null })),
    [setFilters]
  );

  const sourceLabel =
    filters.selectedSources.length === 0
      ? t.allSources
      : filters.selectedSources.length === 1
      ? filters.selectedSources[0]
      : `${filters.selectedSources.length} ${t.sources}`;

  // Translate topic label for display; internal value stays in English for API
  const getTopicDisplayLabel = (label: string) => t.topics[label] ?? label;

  const paywallOptions: { value: PaywallFilter; label: string }[] = [
    { value: "all",      label: t.paywallAll },
    { value: "free",     label: t.paywallFree },
    { value: "paywalled", label: t.paywallOnly },
  ];

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="max-w-[1100px] mx-auto px-4 py-3 space-y-3">

        {/* ROW A — Topics (horizontally scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TOPICS.map((topic) => {
            const isAll = topic.label === "All Topics";
            const active = isAll
              ? filters.selectedTopics.length === 0
              : filters.selectedTopics.includes(topic.label);
            const slug = LABEL_TO_SLUG[topic.label];
            const followed = !isAll && user && slug ? isFollowing(slug) : false;
            return (
              <div key={topic.label} className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => toggleTopic(topic.label)}
                  className={`
                    px-3 py-1.5 rounded-sm text-xs font-medium transition-colors
                    whitespace-nowrap select-none
                    ${active
                      ? "bg-chip-active text-chip-active-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-border"}
                    ${!isAll && user ? "rounded-r-none pr-2" : ""}
                  `}
                >
                  {topic.emoji} {getTopicDisplayLabel(topic.label)}
                </button>
                {!isAll && user && slug && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      followed ? unfollowTopic(slug) : followTopic(slug);
                    }}
                    aria-label={followed ? "Unfollow topic" : "Follow topic"}
                    title={followed ? "Unfollow topic" : "Follow topic"}
                    className={`
                      px-1.5 py-1.5 rounded-r-sm border-l text-xs transition-colors select-none
                      ${active
                        ? "bg-chip-active border-chip-active-foreground/20 text-chip-active-foreground hover:bg-chip-active/80"
                        : "bg-secondary border-border text-muted-foreground hover:bg-border"}
                    `}
                  >
                    <Heart
                      className="w-3 h-3"
                      fill={followed ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ROW B — Quick date buttons + Custom Date Range */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick date buttons */}
          {[
            { label: t.quickToday,     from: todayStr,                                       to: todayStr },
            { label: t.quickYesterday, from: toIsoDate(new Date(Date.now() - 86400000)),     to: toIsoDate(new Date(Date.now() - 86400000)) },
            { label: t.quickLastWeek,  from: toIsoDate(new Date(Date.now() - 7 * 86400000)), to: todayStr },
          ].map(({ label, from, to }) => {
            const active = filters.dateFrom === from && filters.dateTo === to && !filters.timeRange;
            return (
              <button
                key={label}
                onClick={() => active ? clearDates() : selectQuickDate(from, to)}
                className={`
                  px-3 py-1.5 rounded-sm text-xs font-medium transition-colors whitespace-nowrap select-none
                  ${active
                    ? "bg-chip-active text-chip-active-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-border"}
                `}
              >
                {label}
              </button>
            );
          })}
          <span className="hidden sm:inline text-muted-foreground text-xs mx-1">📅</span>
          <input
            type="date"
            value={filters.dateFrom}
            min={thirtyDaysAgoStr}
            max={todayStr}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground w-full sm:w-auto"
            aria-label="Date from"
          />
          <span className="text-xs text-muted-foreground">{t.dateTo}</span>
          <input
            type="date"
            value={filters.dateTo}
            min={thirtyDaysAgoStr}
            max={todayStr}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground w-full sm:w-auto"
            aria-label="Date to"
          />
          {(filters.dateFrom || filters.dateTo) && (
            <button
              onClick={clearDates}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear dates"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ROW C — Search + Multi-Source dropdown + Paywall filter + Clear + Count */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">

          {/* Search */}
          <div className="relative flex-1 min-w-0 sm:min-w-[180px] sm:max-w-[320px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-sm border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Multi-select source dropdown */}
          <div ref={sourceRef} className="relative">
            <button
              onClick={() => setSourceOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground whitespace-nowrap w-full sm:w-auto justify-between"
            >
              <span className={filters.selectedSources.length > 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
                {sourceLabel}
              </span>
              <ChevronDown size={12} className={`transition-transform ${sourceOpen ? "rotate-180" : ""}`} />
            </button>

            {sourceOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-72 overflow-y-auto bg-card border border-border rounded-sm shadow-lg z-50">
                {/* Clear selection row */}
                {filters.selectedSources.length > 0 && (
                  <button
                    onClick={clearSources}
                    className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-secondary border-b border-border font-medium"
                  >
                    {t.clearSelection} ({filters.selectedSources.length})
                  </button>
                )}
                {localeSources.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-muted-foreground italic">
                    No sources yet for this locale.
                  </p>
                ) : (
                  localeSources.map((s) => {
                    const checked = filters.selectedSources.includes(s);
                    return (
                      <label
                        key={s}
                        onClick={() => toggleSource(s)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-secondary cursor-pointer select-none"
                      >
                        <span className={`flex-shrink-0 w-3.5 h-3.5 border rounded-none flex items-center justify-center transition-colors ${checked ? "bg-chip-active border-chip-active" : "border-border bg-background"}`}>
                          {checked && <Check size={9} className="text-chip-active-foreground" />}
                        </span>
                        <span className={checked ? "text-foreground font-medium" : "text-muted-foreground"}>
                          {s}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 3-state paywall filter */}
          <div className="flex items-center rounded-sm border border-border overflow-hidden flex-shrink-0">
            {paywallOptions.map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => setPaywall(opt.value)}
                className={`
                  px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap select-none
                  ${i > 0 ? "border-l border-border" : ""}
                  ${filters.paywallFilter === opt.value
                    ? "bg-chip-active text-chip-active-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Clear all + count */}
          <div className="flex items-center gap-2 sm:ml-auto">
            {isFiltered && (
              <button
                onClick={() => {
                  clearFilters();
                  setSearchInput("");
                }}
                className="text-xs text-primary hover:underline font-medium whitespace-nowrap"
              >
                {t.clearAll}
              </button>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {totalCount} {totalCount !== 1 ? t.articles : t.article}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
