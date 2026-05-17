import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Headphones, ExternalLink } from "lucide-react";
import { usePodcasts } from "@/hooks/useArticles";

// Handles image load errors so the gradient fallback always shows correctly
const PodcastCover = ({ src, title }: { src?: string; title: string }) => {
  const [error, setError] = useState(false);
  if (src && !error) {
    return (
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-[hsl(290,40%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)] flex items-center justify-center">
      <Headphones size={40} className="text-[hsl(0,0%,65%)]" />
    </div>
  );
};

const PodcastSkeleton = () => (
  <div className="border border-border rounded-sm overflow-hidden bg-card animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-muted rounded w-1/4" />
      <div className="h-5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded" />
      <div className="h-3 bg-muted rounded w-5/6" />
      <div className="h-px bg-muted rounded my-3" />
      <div className="h-3 bg-muted rounded w-2/3" />
      <div className="h-3 bg-muted rounded w-1/4" />
      <div className="h-10 bg-muted rounded mt-4" />
    </div>
  </div>
);

const Podcasts = () => {
  const { podcasts, loading } = usePodcasts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-[1400px] mx-auto px-6 py-8">
        <h2 className="headline-xl mb-2">Podcasts</h2>
        <p className="body-lg text-muted-foreground mb-8 max-w-2xl">
          Kuratierte Podcasts rund um Feminismus, Frauen und gesellschaftliche Perspektiven.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <PodcastSkeleton key={i} />)
            : podcasts.map((podcast) => (
                <article
                  key={podcast.feed_url}
                  className="group border border-border rounded-sm overflow-hidden hover:border-foreground/20 transition-colors bg-card"
                >
                  {/* Cover */}
                  <div className="aspect-square overflow-hidden bg-muted">
                    <PodcastCover src={podcast.cover_url} title={podcast.title} />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Headphones size={14} className="text-accent-magenta" />
                      <span className="category-tag category-tag--magenta">Podcast</span>
                    </div>
                    <h3 className="font-headline text-lg font-bold leading-snug mb-1">
                      {podcast.title}
                    </h3>
                    <p className="body-sm text-muted-foreground mb-3 line-clamp-2">
                      {podcast.description}
                    </p>

                    {podcast.latest_ep && (
                      <>
                        <div className="editorial-divider-thin mb-3" />
                        <p className="body-sm text-foreground font-medium text-sm leading-snug mb-1 line-clamp-2 italic">
                          {podcast.latest_ep}
                        </p>
                        {podcast.duration && (
                          <span className="body-sm text-muted-foreground text-xs">
                            {podcast.duration}
                          </span>
                        )}
                      </>
                    )}

                    {podcast.website_url && (
                      <a
                        href={podcast.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 bg-foreground text-primary-foreground rounded-sm py-2.5 px-4 text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={14} />
                        Podcast öffnen
                      </a>
                    )}
                  </div>
                </article>
              ))}
        </div>

        {/* Coming soon teaser */}
        {!loading && (
          <div className="mt-12 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Wir kuratieren laufend neue Stimmen.{" "}
              <span className="text-foreground font-medium">Weitere Podcasts folgen in Kürze.</span>
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
