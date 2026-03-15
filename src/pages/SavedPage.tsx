import { Link } from "react-router-dom";
import { Bookmark, ArrowLeft, Lock } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useSavedArticles, type SavedArticle } from "@/hooks/useSavedArticles";
import { TOPIC_SLUGS, TOPIC_COLORS, type Locale } from "@/lib/constants";

interface SavedPageProps {
  locale?: Locale;
}

function SavedCard({ item, onUnsave }: { item: SavedArticle; onUnsave: (url: string) => void }) {
  const dateStr = item.published_at
    ? format(new Date(item.published_at), "d MMM yyyy")
    : item.saved_at
    ? format(new Date(item.saved_at), "d MMM yyyy")
    : "";

  return (
    <div className="relative bg-card border border-border rounded-sm overflow-hidden group"
         style={{ boxShadow: "var(--tile-shadow)" }}>
      {/* Unsave button */}
      <button
        onClick={() => onUnsave(item.article_url)}
        aria-label="Remove from saved"
        title="Remove from saved"
        className="absolute top-3 right-3 p-1.5 text-primary hover:text-destructive transition-colors z-10"
      >
        <Bookmark className="w-4 h-4" fill="currentColor" strokeWidth={1.5} />
      </button>

      <a
        href={item.article_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Meta row */}
        <div className="flex items-center gap-2 pr-8">
          <span className="inline-block px-2 py-0.5 rounded-sm text-[0.68rem] font-semibold uppercase tracking-wider bg-secondary text-muted-foreground truncate max-w-[55%]">
            {item.source_name}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            {item.is_paywalled && (
              <Lock className="w-3 h-3 text-amber-500" title="Paywalled" />
            )}
            <span className="text-[0.7rem] text-muted-foreground whitespace-nowrap">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif-display text-[1.1rem] font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 pr-8">
          {item.title}
        </h2>

        {/* Summary snapshot */}
        {item.summary_snapshot && (
          <p className="text-[0.82rem] text-muted-foreground line-clamp-2 leading-relaxed">
            {item.summary_snapshot}
          </p>
        )}

        {/* Topic tags */}
        {item.topic_slugs?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.topic_slugs.slice(0, 3).map((slug) => {
              const topic = TOPIC_SLUGS[slug];
              const label = topic?.en ?? slug;
              const colors = TOPIC_COLORS[label];
              return (
                <span
                  key={slug}
                  className="inline-block px-2 py-0.5 text-[0.65rem] font-medium border rounded-none"
                  style={
                    colors
                      ? {
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderColor: colors.border,
                        }
                      : {}
                  }
                >
                  {topic?.emoji} {label}
                </span>
              );
            })}
          </div>
        )}

        {/* Article no longer available notice */}
        {!item.article_url && (
          <p className="text-[0.75rem] text-muted-foreground italic">
            ⚠ Article may no longer be available
          </p>
        )}
      </a>
    </div>
  );
}

export default function SavedPage({ locale = "en" }: SavedPageProps) {
  const { user, loading: authLoading } = useAuth();
  const { savedArticles, isLoading, unsaveArticle } = useSavedArticles();

  const backHref = `/${locale}`;

  // Not signed in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Bookmark className="w-10 h-10 text-muted-foreground" />
        <h1 className="text-xl font-bold">your saved articles</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          sign in to save articles and access them from any device.
        </p>
        <Link
          to={backHref}
          className="text-sm text-muted-foreground underline underline-offset-2 mt-2"
        >
          ← back to the feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to={backHref}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="font-semibold text-sm">saved articles</span>
          </div>
          {savedArticles.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground">
              {savedArticles.length} saved
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Loading state */}
        {(authLoading || isLoading) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-secondary rounded-sm animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !authLoading && savedArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Bookmark className="w-10 h-10 text-muted-foreground" strokeWidth={1} />
            <h2 className="text-lg font-semibold">nothing saved yet — bookmark the stories worth revisiting.</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              click the bookmark icon on any article to save it here.
            </p>
            <Link
              to={backHref}
              className="text-sm font-medium underline underline-offset-2 text-foreground"
            >
              browse the feed →
            </Link>
          </div>
        )}

        {/* Article grid */}
        {!isLoading && savedArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedArticles.map((item) => (
              <SavedCard
                key={item.id}
                item={item}
                onUnsave={unsaveArticle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
