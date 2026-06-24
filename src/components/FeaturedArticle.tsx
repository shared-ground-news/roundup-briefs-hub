import { Share2 } from "lucide-react";
import { useOgImage } from "@/hooks/useOgImage";
import TimedImage from "@/components/TimedImage";

interface FeaturedArticleProps {
  image?: string | null;
  articleUrl?: string | null;
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
  articleUrl,
  category,
  headline,
  summary,
  source,
  date,
  readTime,
  paywalled,
}: FeaturedArticleProps) => {
  const ogImage = useOgImage(articleUrl, !!image);
  const displayImage = image || ogImage;

  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-sm mb-5 bg-muted h-[220px] sm:h-[300px] md:h-[400px]">
        {paywalled && (
          <div className="absolute top-3 right-3 z-10 bg-foreground/75 text-background text-[10px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm select-none">
            €
          </div>
        )}
        <TimedImage
          src={displayImage}
          alt={headline}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
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
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Share"
            onClick={async (e) => {
              e.stopPropagation();
              const url = articleUrl || window.location.href;
              if (navigator.share) {
                await navigator.share({ title: headline, url });
              } else {
                await navigator.clipboard.writeText(url);
              }
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticle;
