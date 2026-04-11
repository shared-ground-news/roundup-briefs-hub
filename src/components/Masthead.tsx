import { type Stats } from "@/lib/constants";
import { format } from "date-fns";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface MastheadProps {
  stats?: Stats | null;
}

const NAV_LINKS = [
  { label: "News Feed", to: "/de" },
  { label: "Analyse", to: "/analyse" },
  { label: "Themen", to: "/themen" },
  { label: "Über uns", to: "/ueber-uns" },
  { label: "Newsletter", to: "/newsletter" },
];

const Masthead = ({ stats }: MastheadProps) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-6 pb-4">
      <div className="flex flex-row items-start justify-between sm:relative sm:min-h-[4.5rem]">

        {/* Left spacer for desktop balance */}
        <div className="hidden sm:block flex-1" />

        {/* Title — centred */}
        <div className="text-center flex-1 flex flex-col items-center">
          <Link to="/">
            <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
              shared ground
            </h1>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            deine nachrichten. deine perspektive.
          </p>
        </div>

        {/* Right: controls */}
        <div className="flex-1 flex flex-col items-end gap-2">
          {/* Buttons row */}
          <div ref={menuRef} className="relative flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex flex-col gap-1.5 p-1 text-foreground hover:opacity-70 transition-opacity"
              aria-label="Menu"
            >
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 w-44 bg-background border border-border shadow-md rounded-sm py-1 z-[9999]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-sans transition-colors hover:bg-secondary ${
                      location.pathname === link.to
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Stats below buttons — only on home, desktop */}
          {location.pathname === "/" && stats && (
            <div className="hidden sm:block text-right text-xs text-muted-foreground uppercase tracking-wider font-sans leading-relaxed">
              <div>{stats.total.toLocaleString()} Artikel</div>
              {lastScraped && <div>Aktualisiert {lastScraped}</div>}
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 border-border" />
    </header>
  );
};

export default Masthead;
