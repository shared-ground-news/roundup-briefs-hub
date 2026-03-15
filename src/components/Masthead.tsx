import { type Stats, type Locale } from "@/lib/constants";
import { type Translations } from "@/lib/translations";
import { format } from "date-fns";
import ThemeToggle from "./ThemeToggle";
import { useNavigate, Link } from "react-router-dom";
import { Bookmark, Mail, UserCircle, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MastheadProps {
  stats: Stats | null;
  showAbout: boolean;
  onAboutToggle: () => void;
  locale: Locale;
  t: Translations;
  onNewsletterClick: () => void;
  onMenuClick: () => void;
}

const Masthead = ({ stats, showAbout, onAboutToggle, locale, t, onNewsletterClick, onMenuClick }: MastheadProps) => {
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();

  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-6 pb-4">

      {/* Mobile: stacked column with centred title.
          Desktop (sm+): relative row — title absolutely centred, controls on right */}
      <div className="flex flex-col items-center gap-3 sm:relative sm:flex sm:flex-row sm:items-center sm:justify-between sm:min-h-[4.5rem] sm:gap-0">

        {/* Title — centred on both mobile and desktop */}
        <div className="text-center sm:absolute sm:inset-0 sm:flex sm:flex-col sm:items-center sm:justify-center pointer-events-none select-none">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            shared ground
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            {t.tagline}
          </p>
        </div>

        {/* Controls — row on mobile, column on desktop (right-aligned) */}
        <div className="flex items-center gap-3 sm:ml-auto sm:flex-col sm:items-end sm:gap-2 relative z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only (sidebar is fixed on desktop) */}
            <button
              onClick={onMenuClick}
              aria-label="open menu"
              className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              onClick={onAboutToggle}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
            >
              {showAbout ? t.back : t.about}
            </button>

            {/* Newsletter button */}
            <button
              onClick={onNewsletterClick}
              aria-label={t.getNewsletter}
              title={t.getNewsletter}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
            </button>

            {/* Sign in — only when logged out */}
            {!user && (
              <button
                onClick={() => requireAuth(() => {})}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
                aria-label="Sign in"
              >
                sign in
              </button>
            )}

            {/* Saved link — always visible; filled icon when signed in */}
            <Link
              to={`/${locale}/saved`}
              aria-label="Saved articles"
              title="Saved articles"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bookmark
                className="w-4 h-4"
                fill={user ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </Link>

            {/* Profile icon — only when signed in */}
            {user && (
              <Link
                to={`/${locale}/profile`}
                aria-label={t.profile}
                title={t.profile}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <UserCircle className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            )}

            {/* Locale toggle — pill style */}
            <div className="flex items-center rounded border border-border text-xs font-sans overflow-hidden">
              <button
                onClick={() => navigate("/en")}
                className={`px-2.5 py-1 transition-colors ${
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
                className={`px-2.5 py-1 transition-colors border-l border-border ${
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
          {!showAbout && stats && (
            <div className="hidden sm:block text-right text-xs text-muted-foreground uppercase tracking-wider font-sans leading-relaxed">
              <div>{stats.total.toLocaleString()} {t.articles}</div>
              {lastScraped && <div>{t.updatedAt} {lastScraped}</div>}
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 border-border" />
    </header>
  );
};

export default Masthead;
