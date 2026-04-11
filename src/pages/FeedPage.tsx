import { Link } from "react-router-dom";
import Masthead from "@/components/Masthead";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";
import SiteFooter from "@/components/SiteFooter";
import ScrollButton from "@/components/ScrollButton";
import { useArticles } from "@/hooks/useArticles";

interface FeedPageProps {
  country: string;
  countryName: string;
}

const FeedPage = ({ country, countryName }: FeedPageProps) => {
  const {
    articles,
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
    hasOlderAvailable,
  } = useArticles(country);

  return (
    <div className="min-h-screen bg-background">
      <Masthead stats={stats} />

      {/* Breadcrumb */}
      <div className="max-w-[1100px] mx-auto px-4 pt-2 pb-1">
        <p className="text-xs text-muted-foreground font-sans">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Weltkarte
          </Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{countryName}</span>
        </p>
      </div>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sources={sources}
        articleCount={articles.length}
        isFiltered={isFiltered}
        clearFilters={clearFilters}
        loading={loading}
      />

      <div className="pt-4 pb-8">
        <ArticleGrid
          articles={articles}
          loading={loading}
          error={error}
          isFiltered={isFiltered}
          clearFilters={clearFilters}
        />

        {!loading && hasOlderAvailable && (
          <div className="max-w-[1100px] mx-auto px-4 py-6 text-center">
            <button
              onClick={loadOlderArticles}
              disabled={loadingOlder}
              className="text-xs text-muted-foreground hover:text-foreground border border-border px-4 py-2 rounded-sm transition-colors disabled:opacity-50"
            >
              {loadingOlder ? "Wird geladen…" : "Ältere Artikel laden (bis 3 Monate)"}
            </button>
          </div>
        )}
      </div>

      <SiteFooter />
      <ScrollButton />
    </div>
  );
};

export default FeedPage;
