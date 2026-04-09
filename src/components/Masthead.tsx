import { type Stats, type Locale } from "@/lib/constants";
import { type Translations } from "@/lib/translations";
import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface MastheadProps {
  stats: Stats | null;
  showAbout: boolean;
  onAboutToggle: () => void;
  locale: Locale;
  t: Translations;
  onNewsletterClick: () => void;
  onContactClick: () => void;
  onScrapingLogicClick: () => void;
}

const Masthead = ({
  stats,
  showAbout,
  onAboutToggle,
  locale,
  t,
  onNewsletterClick,
  onContactClick,
  onScrapingLogicClick,
}: MastheadProps) => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();

  const today = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-4">

      {/* ── Utility bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-2.5">
        <span className="hidden sm:inline text-[0.68rem] text-muted-foreground font-sans uppercase tracking-wider">
          {today}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          {!user && (
            <button
              onClick={() => requireAuth(() => {})}
              className="text-[0.68rem] text-muted-foreground hover:text-foreground transition-colors font-sans"
              aria-label="Sign in"
            >
              sign in
            </button>
          )}
          {user && (
            <Link
              to={`/${locale}/profile`}
              aria-label={t.profile}
              title={t.profile}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <UserCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          )}

          {/* EN / DE pill toggle */}
          <div className="flex items-center rounded border border-border overflow-hidden text-[0.68rem] font-sans">
            <button
              onClick={() => navigate("/en")}
              className={`px-2 py-0.5 transition-colors ${
                locale === "en"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => navigate("/de")}
              className={`px-2 py-0.5 transition-colors border-l border-border ${
                locale === "de"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              aria-label="Zu Deutsch wechseln"
            >
              DE
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>

      <hr className="border-border" />

      {/* ── Title block ──────────────────────────────────────────────────────── */}
      <div className="text-center py-5 select-none">
        <h1 className="font-serif-display text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
          shared ground
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground font-sans tracking-wide">
          {t.tagline}
        </p>
        {stats && (
          <p className="mt-1 text-[0.68rem] text-muted-foreground font-sans">
            {stats.total.toLocaleString()} {t.articles}
            {lastScraped && <> · {t.updatedAt} {lastScraped}</>}
          </p>
        )}
      </div>

      <hr className="border-border" />

      {/* ── Horizontal nav ───────────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-center gap-5 sm:gap-8 py-2.5 overflow-x-auto scrollbar-none"
      >
        <Link
          to={`/${locale}`}
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {locale === "de" ? "Start" : "Home"}
        </Link>

        <Link
          to="/map"
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {locale === "de" ? "Weltkarte" : "Global Map"}
        </Link>

        <button
          onClick={onNewsletterClick}
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          Newsletter
        </button>

        <button
          onClick={onAboutToggle}
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {showAbout ? t.back : t.about}
        </button>

        <button
          onClick={onScrapingLogicClick}
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {locale === "de" ? "Quellen & Logik" : "Sources & Logic"}
        </button>

        <button
          onClick={onContactClick}
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {t.contactUs}
        </button>

        <Link
          to={`/${locale}/saved`}
          className="text-[0.65rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <Bookmark className="w-2.5 h-2.5" fill={user ? "currentColor" : "none"} strokeWidth={1.5} />
          {locale === "de" ? "Gespeichert" : "Saved"}
        </Link>
      </nav>

      <hr className="border-border" />
    </header>
  );
};

export default Masthead;
