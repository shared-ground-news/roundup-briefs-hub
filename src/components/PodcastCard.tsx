import { useState } from "react";
import { Headphones, ExternalLink } from "lucide-react";

interface PodcastCardProps {
  cover?: string | null;
  title: string;
  description?: string;
  latest_ep?: string;
  duration?: string;
  href?: string;
  className?: string;
}

const PodcastCoverSmall = ({ src, title }: { src?: string | null; title: string }) => {
  const [error, setError] = useState(false);
  if (src && !error) {
    return (
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(290,40%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)]">
      <Headphones size={26} className="text-[hsl(0,0%,65%)]" />
    </div>
  );
};

const PodcastCard = ({ cover, title, duration, href, className }: PodcastCardProps) => {
  const card = (
    <article className="group flex gap-3 p-3 bg-card rounded-sm border border-border hover:border-foreground/20 transition-colors cursor-pointer">
      {/* Cover — larger */}
      <div className="w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-muted">
        <PodcastCoverSmall src={cover} title={title} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Headphones size={11} className="text-accent-magenta" />
            <span className="category-tag category-tag--magenta">Podcast</span>
          </div>
          <h4 className="font-semibold text-sm leading-snug group-hover:text-accent-blue transition-colors line-clamp-3">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
          <ExternalLink size={10} className="text-muted-foreground ml-auto" />
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`block${className ? ` ${className}` : ""}`}>
        {card}
      </a>
    );
  }
  return <div className={className}>{card}</div>;
};

export default PodcastCard;
