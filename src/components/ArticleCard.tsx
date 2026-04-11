import { TOPIC_COLORS, getSourceBorderColor } from "@/lib/constants";
import type { Article } from "@/lib/constants";

type Variant = "hero" | "medium" | "default";

interface Props {
  article: Article & { image_url?: string };
  variant?: Variant;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "";
  }
}

function TopicTags({ topics, limit = 3 }: { topics: string; limit?: number }) {
  const list = (topics || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, limit);

  if (list.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {list.map((t) => {
        const colors = TOPIC_COLORS[t];
        return (
          <span
            key={t}
            className="inline-flex items-center px-1.5 py-0.5 text-[0.62rem] font-medium rounded-sm border"
            style={
              colors
                ? { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }
                : { backgroundColor: "var(--secondary)", color: "var(--foreground)", borderColor: "var(--border)" }
            }
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}

const ArtikelLink = ({ href, className }: { href: string; className: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {"Artikel lesen \u2192"}
  </a>
);

const ArticleCard = ({ article, variant = "default" }: Props) => {
  const borderColor = getSourceBorderColor(article.source);
  const date = formatDate(article.published_at || article.scraped_at);
  const imageUrl = (article as Article & { image_url?: string }).image_url;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const parent = e.currentTarget.parentElement;
    if (parent) parent.style.display = "none";
  };

  if (variant === "hero") {
    return (
      <article className="group bg-card border border-border overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row">
          {imageUrl && (
            <div className="sm:w-[48%] flex-shrink-0 overflow-hidden">
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-56 sm:h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                onError={handleImgError}
              />
            </div>
          )}
          <div
            className="flex flex-col justify-between p-5 sm:p-6 flex-1"
            style={{
              borderLeft: imageUrl ? "3px solid " + borderColor : undefined,
              borderTop: !imageUrl ? "3px solid " + borderColor : undefined,
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {article.source}
                </span>
                {date && (
                  <span className="text-xs text-muted-foreground">{date}</span>
                )}
                {article.is_paywalled && (
                  <span className="text-xs text-muted-foreground">🔒</span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              {article.summary && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {article.summary}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-2">
              {article.topics && <TopicTags topics={article.topics} limit={3} />}
              <ArtikelLink
                href={article.link}
                className="text-xs font-semibold text-primary hover:underline underline-offset-2"
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "medium") {
    return (
      <article
        className="group bg-card border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
        style={{ borderTop: "3px solid " + borderColor }}
      >
        {imageUrl && (
          <div className="overflow-hidden">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
              onError={handleImgError}
            />
          </div>
        )}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wider">
              {article.source}
            </span>
            {date && (
              <span className="text-[0.65rem] text-muted-foreground">{date}</span>
            )}
            {article.is_paywalled && (
              <span className="text-[0.65rem] text-muted-foreground">🔒</span>
            )}
          </div>
          <h3 className="text-base font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-3 flex-1">
            {article.title}
          </h3>
          <div className="flex flex-col gap-2 mt-auto">
            {article.topics && <TopicTags topics={article.topics} limit={2} />}
            <ArtikelLink
              href={article.link}
              className="text-xs text-primary hover:underline underline-offset-2 font-medium"
            />
          </div>
        </div>
      </article>
    );
  }

  // default variant
  return (
    <article
      className="group bg-card border border-border overflow-hidden hover:shadow-sm transition-shadow flex flex-col h-full"
      style={{ borderTop: "3px solid " + borderColor }}
    >
      {imageUrl && (
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={handleImgError}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[0.6rem] font-semibold text-muted-foreground uppercase tracking-wider">
            {article.source}
          </span>
          {date && (
            <span className="text-[0.6rem] text-muted-foreground">{date}</span>
          )}
          {article.is_paywalled && (
            <span className="text-[0.6rem] text-muted-foreground">🔒</span>
          )}
        </div>
        <h3 className="text-sm font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-3 flex-1">
          {article.title}
        </h3>
        {!imageUrl && article.summary && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {article.summary}
          </p>
        )}
        <div className="flex flex-col gap-1.5 mt-auto">
          {article.topics && <TopicTags topics={article.topics} limit={2} />}
          <ArtikelLink
            href={article.link}
            className="text-xs text-primary hover:underline underline-offset-2"
          />
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
