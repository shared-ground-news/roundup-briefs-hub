import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/lib/constants";

interface Props {
  articles: Article[];
  loading: boolean;
  error: string | null;
  isFiltered: boolean;
  clearFilters: () => void;
}

const SkeletonCard = ({ tall = false }: { tall?: boolean }) => (
  <div className={`bg-card border border-border animate-pulse rounded-sm ${tall ? "h-72" : "h-48"}`} />
);

const ArticleGrid = ({ articles, loading, error, isFiltered, clearFilters }: Props) => {

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 space-y-4">
        <SkeletonCard tall />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-sm mb-3">
          {isFiltered
            ? "Keine Artikel für diese Filterauswahl gefunden."
            : "Noch keine Artikel verfügbar."}
        </p>
        {isFiltered && (
          <button onClick={clearFilters} className="text-xs text-primary hover:underline font-medium">
            Filter zurücksetzen
          </button>
        )}
      </div>
    );
  }

  const hero = articles[0];
  const featured = articles.slice(1, 4);
  const rest = articles.slice(4);

  return (
    <div className="max-w-[1100px] mx-auto px-4 space-y-4">

      {/* Hero */}
      <ArticleCard article={hero} variant="hero" />

      {/* Featured row (3 mittlere Kacheln) */}
      {featured.length > 0 && (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${featured.length}, 1fr)` }}
        >
          {featured.map((a) => (
            <ArticleCard key={a.id} article={a} variant="medium" />
          ))}
        </div>
      )}

      {rest.length > 0 && <div className="border-t border-border pt-1" />}

      {/* Standard grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((a) => (
            <ArticleCard key={a.id} article={a} variant="default" />
          ))}
        </div>
      )}

    </div>
  );
};

export default ArticleGrid;
