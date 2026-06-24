import { useOgImage } from "@/hooks/useOgImage";
import TimedImage from "@/components/TimedImage";

interface ArticleTileProps {
  image?: string | null;
  category: string;
  categoryColor?: "blue" | "orange" | "magenta";
  headline: string;
  source: string;
  date: string;
  href?: string;
  paywalled?: boolean;
}

const ArticleTile = ({
  image,
  category,
  categoryColor = "blue",
  headline,
  source,
  date,
  href,
  paywalled,
}: ArticleTileProps) => {
  const ogImage = useOgImage(href, !!image);
  const src = image || ogImage;

  const colorClass =
    categoryColor === "orange"
      ? "category-tag--orange"
      : categoryColor === "magenta"
      ? "category-tag--magenta"
      : "";

  const card = (
    <article className="group cursor-pointer">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-muted mb-3">
        {paywalled && (
          <div className="absolute top-2 right-2 z-10 bg-foreground/75 text-background text-[9px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm select-none leading-none">
            €
          </div>
        )}
        <TimedImage
          src={src}
          alt={headline}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <span className={`category-tag ${colorClass} text-[10px]`}>{category}</span>
      <h4 className="font-headline text-[15px] font-bold leading-snug mt-1.5 group-hover:text-accent-blue transition-colors line-clamp-3">
        {headline}
      </h4>
      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground uppercase tracking-wide">
        <span>{source}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
    </article>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {card}
      </a>
    );
  }
  return card;
};

export default ArticleTile;
