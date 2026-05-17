import { type Article, getArticleCategory, timeAgo } from "@/lib/api";

interface TrendingListProps {
  articles?: Article[];
}

// Static fallback items shown when no real articles are available yet
const STATIC_ITEMS = [
  { category: "Policy", headline: "EU Parliament Passes Landmark Gender Pay Transparency Directive", date: "2h ago" },
  { category: "Culture", headline: "How Gen Z Is Redefining Feminist Activism Through Social Media", date: "4h ago" },
  { category: "Rights", headline: "Supreme Court to Hear Case on Reproductive Healthcare Access", date: "5h ago" },
  { category: "Global", headline: "Afghan Women Launch Underground Education Network", date: "6h ago" },
  { category: "Science & Tech", headline: "AI Bias in Hiring Tools Disproportionately Affects Women", date: "8h ago" },
  { category: "Economy", headline: "New Study Reveals Motherhood Penalty Still Costs Women $16K Annually", date: "10h ago" },
  { category: "Policy", headline: "Record Number of Women Elected in Latin American Regional Elections", date: "12h ago" },
];

const TrendingList = ({ articles }: TrendingListProps) => {
  const hasReal = articles && articles.length > 0;

  return (
    <div>
      <div className="editorial-divider mb-3" />
      <h3 className="font-headline text-lg font-bold mb-4 uppercase tracking-wide">
        Trending
      </h3>
      <div className="space-y-0">
        {hasReal
          ? articles.slice(0, 7).map((article, idx) => {
              const category = getArticleCategory(article);
              const date = timeAgo(article.published_at || article.scraped_at);
              return (
                <a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <article className="group flex gap-3 py-3 border-b border-border cursor-pointer">
                    <span className="text-3xl font-headline font-black text-accent-blue/30 leading-none mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="category-tag--orange category-tag">
                        {category}
                      </span>
                      <h4 className="headline-sm mt-0.5 text-sm leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <span className="body-sm text-muted-foreground text-xs mt-1 block">
                        {date}
                      </span>
                    </div>
                  </article>
                </a>
              );
            })
          : STATIC_ITEMS.map((item, idx) => (
              <article
                key={idx}
                className="group flex gap-3 py-3 border-b border-border cursor-pointer"
              >
                <span className="text-3xl font-headline font-black text-accent-blue/30 leading-none mt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="category-tag--orange category-tag">
                    {item.category}
                  </span>
                  <h4 className="headline-sm mt-0.5 text-sm leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">
                    {item.headline}
                  </h4>
                  <span className="body-sm text-muted-foreground text-xs mt-1 block">
                    {item.date}
                  </span>
                </div>
              </article>
            ))}
      </div>
    </div>
  );
};

export default TrendingList;
