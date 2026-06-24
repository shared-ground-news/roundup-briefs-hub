import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mail } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

const navItems = [
  { label: "News Feed", path: "/de" },
  { label: "Podcasts", path: "/podcasts" },
  { label: "About", path: "/about" },
];

// Hysteresis: collapse when scrolled past 100px, expand when back under 40px.
// Gap (60px) > desktop height delta (~61px logo row) — no oscillation possible.
const COLLAPSE_AT = 100;
const EXPAND_AT = 40;

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailEmail, setMailEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const mailRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { subscribe, isLoading, isSuccess } = useNewsletterSubscription();

  // ── Scroll detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > COLLAPSE_AT) return true;
        if (prev && y < EXPAND_AT) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Keep --header-height in sync via ResizeObserver ─────────────────────────
  // TopicFilterBar reads this to know exactly where to stick.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--header-height",
        `${el.offsetHeight}px`
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Lock body scroll when drawer is open ────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Close mail popover on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mailRef.current && !mailRef.current.contains(e.target as Node)) {
        setMailOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailEmail) return;
    await subscribe({ email: mailEmail });
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 bg-background">

        {/* ── ROW 1 — always visible ──────────────────────────────────────────
            Not scrolled: [date]                          [✉] [☰]
            Scrolled:     [date]  Shared Ground (center)  [✉] [☰]
        ──────────────────────────────────────────────────────────────────── */}
        <div className="border-b border-border">
          <div className="container max-w-[1400px] mx-auto px-4 py-2 relative flex items-center justify-between">

            {/* Date — left */}
            <span className="body-sm text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="body-sm text-muted-foreground sm:hidden">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            {/* Compact logo — absolute center, only when scrolled */}
            {scrolled && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Link to="/de" className="pointer-events-auto">
                  <span className="font-headline text-base font-black tracking-tight text-foreground">
                    Shared Ground
                  </span>
                </Link>
              </div>
            )}

            {/* Icons — right */}
            <div className="flex items-center gap-3">
              {/* Newsletter popover */}
              <div className="relative flex items-center" ref={mailRef}>
                <button
                  onClick={() => setMailOpen((o) => !o)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Newsletter"
                >
                  <Mail size={18} />
                </button>
                {mailOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-background border border-border shadow-lg rounded-sm p-4 z-50">
                    {isSuccess ? (
                      <p className="text-sm font-medium py-2">Du bist auf der Liste ✓</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                          Newsletter
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Wir schreiben dir, wenn es losgeht.
                        </p>
                        <form onSubmit={handleMailSubmit} className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={mailEmail}
                            onChange={(e) => setMailEmail(e.target.value)}
                            placeholder="deine@email.de"
                            className="flex-1 border border-border rounded-sm px-3 py-2 text-xs bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-foreground text-primary-foreground px-3 py-2 text-xs font-semibold rounded-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                          >
                            {isLoading ? "…" : "OK"}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hamburger — always (desktop + mobile) */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 2 — big logo, only when NOT scrolled ────────────────────────
            Scrolls off the page once compact mode kicks in.
        ──────────────────────────────────────────────────────────────────── */}
        {!scrolled && (
          <div className="border-b border-border text-center py-3">
            <Link to="/de">
              <h1 className="font-headline text-3xl font-black tracking-tight text-foreground">
                Shared Ground
              </h1>
            </Link>
          </div>
        )}
      </header>

      {/* ── Side drawer — slides in from the right ──────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[45] bg-black/30 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Drawer panel */}
      <nav
        className={`fixed top-0 right-0 h-full w-1/2 max-w-xs bg-background z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end px-5 py-4 border-b border-border">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        {/* Nav links */}
        <ul className="flex flex-col divide-y divide-border">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-8 py-5 text-sm font-medium uppercase tracking-widest transition-colors ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
