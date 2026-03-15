import { type Translations } from "@/lib/translations";

interface SiteFooterProps {
  onNewsletterClick: () => void;
  onContactClick: () => void;
  t: Translations;
}

const SiteFooter = ({ onNewsletterClick, onContactClick, t }: SiteFooterProps) => (
  <footer className="max-w-[1100px] mx-auto px-4 py-8 mt-12 border-t border-border">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
      <p>shared ground · built for readers who refuse the algorithm · updated daily</p>
      <div className="flex items-center gap-4">
        <button
          onClick={onContactClick}
          className="hover:text-foreground transition-colors underline underline-offset-2"
        >
          {t.contactUs}
        </button>
        <button
          onClick={onNewsletterClick}
          className="hover:text-foreground transition-colors underline underline-offset-2"
        >
          {t.getNewsletter}
        </button>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
