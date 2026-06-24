import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mail } from "lucide-react";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

const navItems = [
  { label: "News Feed", path: "/de" },
  { label: "Podcasts", path: "/podcasts" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailEmail, setMailEmail] = useState("");
  const mailRef = useRef<HTMLDivElement>(null);
  const { subscribe, isLoading, isSuccess } = useNewsletterSubscription();

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
      {/* ── STICKY COMPACT HEADER — always same height, no layout shift ── */}
      <header className="sticky top-0 z-50 bg-background">
        {/* Date row + icons */}
        <div className="border-b border-border">
          <div className="container max-w-[1400px] mx-auto px-4 md:px-6 py-2 flex justify-between items-center">
            <span className="body-sm text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </span>
            <span className="body-sm text-muted-foreground sm:hidden">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <div className="flex items-center gap-3 md:gap-4">
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
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1">Newsletter</p>
                        <p className="text-xs text-muted-foreground mb-3">Wir schreiben dir, wenn es losgeht.</p>
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
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav — desktop only */}
        <div className="hidden md:block border-b border-border">
          <nav className="container max-w-[1400px] mx-auto px-6">
            <ul className="flex items-center justify-center gap-8 py-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      location.pathname === item.path
                        ? "!text-foreground border-b-2 border-foreground pb-2"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* ── MOBILE NAV overlay ── */}
      {menuOpen && (
        <nav className="fixed top-[37px] left-0 right-0 bg-background border-b border-border shadow-lg z-40 md:hidden">
          <ul className="flex flex-col divide-y divide-border">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-4 text-sm font-medium uppercase tracking-widest transition-colors ${
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
      )}
      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
