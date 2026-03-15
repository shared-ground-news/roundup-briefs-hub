import { type Article } from "@/lib/constants";
import { TOPICS, TOPIC_COLORS } from "@/lib/constants";
import { type Translations } from "@/lib/translations";
import ArticleCard from "./ArticleCard";

const SECTION_MAX = 6; // max articles per topic section in grouped view

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  isFiltered: boolean;
  isGrouped: boolean;
  clearFilters: () => void;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  onTopicClick: (topic: string) => void;
  t: Translations;
}

const SkeletonTile = () => (
  <div className="bg-card border border-border rounded-sm overflow-hidden animate-pulse">
    <div className="h-[3px] bg-secondary" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-16 rounded-sm bg-secondary" />
        <div className="h-4 w-20 rounded-sm bg-secondary" />
      </div>
      <div className="h-6 w-3/4 rounded-sm bg-secondary" />
      <div className="h-5 w-full rounded-sm bg-secondary" />
      <div className="h-4 w-5/6 rounded-sm bg-secondary" />
      <div className="flex gap-1.5">
        <div className="h-4 w-16 rounded-sm bg-secondary" />
        <div className="h-4 w-20 rounded-sm bg-secondary" />
      </div>
      <div className="h-3 w-24 rounded-sm bg-secondary" />
    </div>
  </div>
);

// ── Grouped (homepage) view ────────────────────────────────────────────────────

interface GroupedViewProps {
  articles: Article[];
  onTopicClick: (topic: string) => void;
  t: Translations;
}

const GroupedView = ({ articles, onTopicClick, t }: GroupedViewProps) => {
  // Build a map: topicLabel → articles whose PRIMARY topic matches
  // Primary topic = the first entry in the comma-separated `topics` string
  const grouped: Record<string, Article[]> = {};

  for (const article of articles) {
    const primary = (article.topics ?? "")
      .split(",")[0]
      .trim();
    if (!primary) continue;
    if (!grouped[primary]) grouped[primary] = [];
    grouped[primary].push(article);
  }

  // Render sections in TOPICS order (skip "All Topics" entry)
  const topicDefs = TOPICS.filter((t) => t.label !== "All Topics");

  const sections = topicDefs
    .map((topic) => ({
      label: topic.label,
      emoji: topic.emoji,
      articles: grouped[topic.label] ?? [],
    }))
    .filter((s) => s.articles.length > 0);

  // Articles not captured by any named section (empty topics, slug-keyed, or DE topic names)
  const renderedIds = new Set(sections.flatMap((s) => s.articles.map((a) => a.id)));
  const fallback = articles.filter((a) => !renderedIds.has(a.id));

  if (sections.length === 0 && fallback.length === 0) {
    return null; // parent handles empty state
  }

  // No named sections at all → flat grid (e.g. DE articles with unrecognised topic labels)
  if (sections.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fallback.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map(({ label, emoji, articles: sectionArticles }) => {
        const colors = TOPIC_COLORS[label];
        const preview = sectionArticles.slice(0, SECTION_MAX);
        const hasMore = sectionArticles.length > SECTION_MAX;

        return (
          <section key={label}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-sm"
                  style={
                    colors
                      ? {
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }
                      : {}
                  }
                >
                  {emoji} {t.topics[label] ?? label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sectionArticles.length}{" "}
                  {sectionArticles.length !== 1 ? t.articles : t.article}
                </span>
              </div>

              {hasMore && (
                <button
                  onClick={() => onTopicClick(label)}
                  className="text-xs text-primary hover:underline font-medium whitespace-nowrap"
                >
                  {t.seeAll ?? "See all"} →
                </button>
              )}
            </div>

            {/* Article grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {preview.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const ArticleGrid = ({
  articles,
  loading,
  error,
  isFiltered,
  isGrouped,
  clearFilters,
  page,
  totalPages,
  setPage,
  onTopicClick,
  t,
}: ArticleGridProps) => {
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTile key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.serverWaking}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.noArticles}</p>
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-primary hover:underline font-medium"
          >
            {t.clearFilters}
          </button>
        )}
      </div>
    );
  }

  // ── Grouped view (no active filters) ─────────────────────────────────────────
  if (isGrouped) {
    return (
      <div className="max-w-[1100px] mx-auto px-4">
        <GroupedView articles={articles} onTopicClick={onTopicClick} t={t} />
      </div>
    );
  }

  // ── Flat paginated view (filters active) ──────────────────────────────────────
  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </main>

      {/* Pagination controls — only shown when there's more than one page */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="text-xs px-3 py-1.5 rounded-sm border border-border bg-card text-foreground
              hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.prevPage}
          </button>

          <span className="text-xs text-muted-foreground select-none">
            {page} {t.pageOf} {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="text-xs px-3 py-1.5 rounded-sm border border-border bg-card text-foreground
              hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.nextPage}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;
