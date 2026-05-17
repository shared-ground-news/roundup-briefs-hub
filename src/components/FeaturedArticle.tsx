import { Bookmark, Share2 } from "lucide-react";

interface FeaturedArticleProps {
  image?: string | null;
  category: string;
  headline: string;
  summary: string;
  source: string;
  date: string;
  readTime: string;
  paywalled?: boolean;
}

const FeaturedArticle = ({
  image,
  category,
  headline,
  summary,
  source,
  date,
  readTime,
  paywalled,
}: FeaturedArticleProps) => {
  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-sm mb-5 bg-muted h-[400px]">
        {paywalled && (
          <div className="absolute top-3 right-3 z-10 bg-foreground/75 text-background text-[10px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm select-none">
            €
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={headline}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)] flex items-center justify-center">
            <span className="select-none text-[hsl(0,0%,58%)] text-sm font-medium tracking-widest">
              Image loading…
            </span>
          </div>
        )}
      </div>
      <span className="category-tag">{category}</span>
      <h2 className="headline-xl mt-2 group-hover:text-accent-blue transition-colors">
        {headline}
      </h2>
      <p className="body-lg text-muted-foreground mt-4 max-w-2xl">
        {summary}
      </p>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="body-sm text-muted-foreground">{source}</span>
          <span className="text-muted-foreground">·</span>
          <span className="body-sm text-muted-foreground">{date}</span>
          <span className="text-muted-foreground">·</span>
          <span className="body-sm text-muted-foreground">{readTime}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Share">
            <Share2 size={16} />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Save">
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
