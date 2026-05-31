import { type Stats, type Locale } from "@/lib/constants";
import { format } from "date-fns";
import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MastheadProps {
  stats: Stats | null;
  showAbout: boolean;
  onAboutToggle: () => void;
  locale: Locale;
  onNewsletterClick: () => void;
}

const Masthead = ({
  stats,
  showAbout,
  onAboutToggle,
  locale,
  onNewsletterClick,
}: MastheadProps) => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();

  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  const tagline =
    locale === "de"
      ? "feministische nachrichten. weltweit."
      : "browse your news on your terms.";

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-6 pb-4">
      {/*
        Mobile:  stacked column, title centred on top
        Desktop: relative row — title absolutely centred, left/right slots float
      */}
      <div className="flex flex-col items-center gap-3 sm:relative sm:flex sm:flex-row sm:items-center sm:justify-between sm:min-h-[4.5rem] sm:gap-0">

        {/* ── LEFT slot — locale + nav ─────────────────────────────────── */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2 relative z-10">
          {/* Locale toggle */}
          <div className="flex items-center gap-1 text-xs font-sans text-muted-foreground">
            <button
              onClick={() => navigate("/en")}
              className={`transition-colors ${
                locale === "en"
                  ? "text-foreground font-semibold"
                  : "hover:text-foreground"
              }`}
            >
              EN
            </button>
            <span className="select-none opacity-40">|</span>
            <button
              onClick={() => navigate("/de")}
              className={`transition-colors ${
                locale === "de"
                  ? "text-foreground font-semibold"
                  : "hover:text-foreground"
              }`}
            >
              DE
            </button>
          </div>

          {/* Nav links on desktop */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground font-sans">
            <button
              onClick={onNewsletterClick}
              className="hover:text-foreground transition-colors"
            >
              newsletter
            </button>
            <Link
              to={`/${locale}/saved`}
              className="hover:text-foreground transition-colors"
            >
              saved
            </Link>
          </div>
        </div>

        {/* ── CENTRE — title block (absolutely centred on desktop) ─────── */}
        <div className="text-center sm:absolute sm:inset-0 sm:flex sm:flex-col sm:items-center sm:justify-center pointer-events-none select-none">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            shared ground
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            {tagline}
          </p>
        </div>

        {/* ── RIGHT slot — about + auth + theme ───────────────────────── */}
        <div className="flex items-center gap-3 sm:ml-auto sm:flex-col sm:items-end sm:gap-2 relative z-10">
          <div className="flex items-center gap-3">
            {!user ? (
              <button
                onClick={() => requireAuth(() => {})}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
              >
                sign in
              </button>
            ) : (
              <Link
                to={`/${locale}/profile`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
              >
                profile
              </Link>
            )}
            <button
              onClick={onAboutToggle}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
            >
              {showAbout ? "← back" : "about"}
            </button>
            <ThemeToggle />
          </div>

          {!showAbout && stats && (
            <div className="hidden sm:block text-right text-xs text-muted-foreground uppercase tracking-wider font-sans leading-relaxed">
              <div>{stats.total.toLocaleString()} articles</div>
              {lastScraped && <div>updated {lastScraped}</div>}
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 border-border" />
    </header>
  );
};

export default Masthead;
