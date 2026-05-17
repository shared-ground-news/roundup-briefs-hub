import { Bookmark, Play } from "lucide-react";

interface ArticleCardSmallProps {
  thumbnail?: string | null;
  category: string;
  categoryColor?: "blue" | "orange" | "magenta";
  headline: string;
  source: string;
  date: string;
  href?: string;
  isVideo?: boolean;
  variant?: "default" | "sidebar";
  paywalled?: boolean;
}

const PaywallBadge = () => (
  <div className="absolute top-1.5 right-1.5 z-10 bg-foreground/75 text-background text-[9px] font-semibold px-1 py-0.5 rounded-sm backdrop-blur-sm select-none leading-none">
    €
  </div>
);

const ArticleCardSmall = ({
  thumbnail,
  category,
  categoryColor = "blue",
  headline,
  source,
  date,
  href,
  isVideo = false,
  variant = "default",
  paywalled = false,
}: ArticleCardSmallProps) => {
  const hasImage = !!thumbnail;

  const colorClass =
    categoryColor === "orange"
      ? "category-tag--orange"
      : categoryColor === "magenta"
      ? "category-tag--magenta"
      : "";

  const content =
    variant === "sidebar" ? (
      <article className="group flex gap-3 py-4 border-b border-[hsl(0,0%,90%)] last:border-b-0 cursor-pointer">
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-muted">
          {hasImage ? (
            <img
              src={thumbnail!}
              alt={headline}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)] flex items-center justify-center">
              <span className="select-none text-[hsl(0,0%,58%)] text-[9px] font-medium tracking-wider text-center leading-tight px-1">
                Image<br />loading…
              </span>
            </div>
          )}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
              <Play size={20} className="text-primary-foreground fill-current" />
            </div>
          )}
          {paywalled && <PaywallBadge />}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-orange">
              {category}
            </span>
            <h3 className="text-[16px] font-bold leading-[1.3] text-[hsl(0,0%,7%)] mt-1 group-hover:text-accent-blue transition-colors">
              {headline}
            </h3>
          </div>
          <span className="text-[10px] uppercase tracking-[0.08em] text-[hsl(0,0%,53%)]">
            {source} · {date}
          </span>
        </div>
      </article>
    ) : (
      <article className="group flex gap-4 py-4 border-b border-border last:border-b-0 cursor-pointer">
        <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
          {hasImage ? (
            <img
              src={thumbnail!}
              alt={headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)] flex items-center justify-center">
              <span className="select-none text-[hsl(0,0%,58%)] text-[9px] font-medium tracking-wider text-center leading-tight px-1">
                Image<br />loading…
              </span>
            </div>
          )}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
              <Play size={20} className="text-primary-foreground fill-current" />
            </div>
          )}
          {paywalled && <PaywallBadge />}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-tag ${colorClass}`}>{category}</span>
          <h3 className="headline-sm mt-1 group-hover:text-accent-blue transition-colors line-clamp-2">
            {headline}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="body-sm text-muted-foreground">{source}</span>
            <span className="text-muted-foreground">·</span>
            <span className="body-sm text-muted-foreground">{date}</span>
          </div>
        </div>
        <button
          className="self-start mt-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Save article"
          onClick={(e) => e.preventDefault()}
        >
          <Bookmark size={16} />
        </button>
      </article>
    );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default ArticleCardSmall;
