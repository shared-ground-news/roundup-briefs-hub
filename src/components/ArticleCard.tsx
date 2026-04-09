import { format } from "date-fns";
import { type Article, getSourceBorderColor } from "@/lib/constants";
import { Languages } from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

export type CardVariant = "hero" | "medium" | "default";

interface ArticleCardProps {
  article: Article;
  variant?: CardVariant;
}

const MAX_VISIBLE_TAGS = 3;

const TOPIC_ICONS: Record<string, string> = {
  "Bodily Autonomy & Reproductive Justice": "🩺",
  "Anti-Rights & Backlash Movements":       "🔥",
  "Economic & Labour Justice":              "💰",
  "Migration, Borders & Citizenship":       "🌍",
  "State Power, Law & Governance":          "⚖️",
  "Violence, Safety & Criminal Justice":    "🛡️",
  "Climate & Environmental Justice":        "🌿",
  "Technology & Digital Power":             "💻",
  "Culture, Media & Narrative Power":       "🎭",
};

const MetaRow = ({
  article,
  dateStr,
  isPaywalled,
}: {
  article: Article;
  dateStr: string;
  isPaywalled: boolean;
}) => {
  const translateLink =
    article.locale === "de"
      ? `https://translate.google.com/translate?sl=de&tl=en&u=${encodeURIComponent(article.link)}`
      : `https://translate.google.com/translate?sl=en&tl=de&u=${encodeURIComponent(article.link)}`;
  const translateLabel =
    article.locale === "de" ? "translate to english" : "auf deutsch lesen";

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-block px-2 py-0.5 rounded-sm text-[0.68rem] font-semibold uppercase tracking-wider bg-secondary text-muted-foreground truncate max-w-[55%]">
        {article.source}
      </span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isPaywalled && (
          <span title="Paywalled article" className="text-[0.7rem] text-amber-500 leading-none select-none">
            🔒
          </span>
        )}
        <span className="text-[0.7rem] text-muted-foreground whitespace-nowrap">{dateStr}</span>
        <a
          href={translateLink}
          target="_blank"
          rel="noopener noreferrer"
          title={translateLabel}
          aria-label={translateLabel}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Languages className="w-3.5 h-3.5" strokeWidth={1.5} />
        </a>
        <BookmarkButton article={article} />
      </div>
    </div>
  );
};

const TopicTags = ({ topics, max = MAX_VISIBLE_TAGS }: { topics: string[]; max?: number }) => {
  if (topics.length === 0) return null;
  const visible = topics.slice(0, max);
  const extra = topics.length - max;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((topic) => (
        <span
          key={topic}
          className="inline-block px-2 py-0.5 text-[0.65rem] font-medium border border-border bg-background text-foreground rounded-none"
        >
          {TOPIC_ICONS[topic] ? `${TOPIC_ICONS[topic]} ` : ""}
          {topic}
        </span>
      ))}
      {extra > 0 && (
        <span className="inline-block px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
          +{extra}
        </span>
      )}
    </div>
  );
};

const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  const stripColor = getSourceBorderColor(article.source);
  const topics = (article.topics || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const displayDate = article.published_at || article.scraped_at;
  const dateStr = displayDate ? format(new Date(displayDate), "d MMM yyyy") : "";
  const isPaywalled = article.is_paywalled === true;

  const baseClass =
    "block bg-card border border-border rounded-sm overflow-hidden transition-all duration-150 hover:bg-surface-hover hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group";

  // ── Hero ──────────────────────────────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        style={{ borderLeft: `4px solid ${stripColor}`, boxShadow: "var(--tile-shadow)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--tile-shadow-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--tile-shadow)"; }}
      >
        <div className="p-6 flex flex-col gap-3">
          <MetaRow article={article} dateStr={dateStr} isPaywalled={isPaywalled} />
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-3">
            {article.title}
          </h2>
          {article.summary && (
            <p className="text-sm text-muted-foreground line-clamp-5 leading-relaxed">
              {article.summary}
            </p>
          )}
          <div className="flex items-end justify-between gap-2 mt-auto pt-1">
            <TopicTags topics={topics} />
            <span className="text-xs text-muted-foreground group-hover:underline whitespace-nowrap ml-auto">
              read full article →
            </span>
          </div>
        </div>
      </a>
    );
  }

  // ── Medium ────────────────────────────────────────────────────────────────────
  if (variant === "medium") {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        style={{ borderTop: `3px solid ${stripColor}`, boxShadow: "var(--tile-shadow)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--tile-shadow-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--tile-shadow)"; }}
      >
        <div className="p-5 flex flex-col gap-3 h-full">
          <MetaRow article={article} dateStr={dateStr} isPaywalled={isPaywalled} />
          <h2 className="font-serif-display text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
            {article.title}
          </h2>
          {article.summary && (
            <p className="text-[0.85rem] text-muted-foreground line-clamp-3 leading-relaxed">
              {article.summary}
            </p>
          )}
          <div className="flex flex-col gap-2 mt-auto">
            <TopicTags topics={topics} max={2} />
            <span className="text-xs text-muted-foreground group-hover:underline">
              read full article →
            </span>
          </div>
        </div>
      </a>
    );
  }

  // ── Default ───────────────────────────────────────────────────────────────────
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
      style={{ boxShadow: "var(--tile-shadow)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--tile-shadow-hover)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--tile-shadow)"; }}
    >
      <div className="h-[3px] w-full" style={{ backgroundColor: stripColor }} />
      <div className="p-5 flex flex-col gap-3">
        <MetaRow article={article} dateStr={dateStr} isPaywalled={isPaywalled} />
        <h2 className="font-serif-display text-[1.2rem] font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h2>
        {article.summary && (
          <p className="text-[0.85rem] text-muted-foreground line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        )}
        <TopicTags topics={topics} />
        <span className="text-xs text-muted-foreground group-hover:underline mt-auto">
          read full article →
        </span>
      </div>
    </a>
  );
};

export default ArticleCard;
