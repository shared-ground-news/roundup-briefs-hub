import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Bookmark, Menu, X, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

const navItems = [
  { label: "Home", path: "/de" },
  { label: "Podcasts", path: "/podcasts" },
  { label: "About", path: "/about" },
  { label: "Saved", path: "/saved" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, requireAuth, signOut } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleUserClick = () => {
    if (user) {
      signOut();
      showToast("Abgemeldet.");
    } else {
      requireAuth(() => {});
    }
  };

  return (
    <>
    <header className="w-full border-b border-border bg-background sticky top-0 z-50 relative">
      {/* Top bar with date */}
      <div className="border-b border-border">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-6 py-2 flex justify-between items-center">
          <span className="body-sm text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="body-sm text-muted-foreground sm:hidden">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => showToast("Suche wird bald verfügbar sein.")} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
              <Search size={18} />
            </button>
            <button onClick={() => navigate("/saved")} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Saved articles">
              <Bookmark size={18} />
            </button>
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
            <button onClick={handleUserClick} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" aria-label={user ? "Sign out" : "Sign in"}>
              <User size={18} />
              <span className="body-sm font-medium hidden md:inline">{user ? "Sign Out" : "Sign In"}</span>
            </button>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {toast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-[13px] px-5 py-2.5 rounded-sm shadow-lg pointer-events-none">
              {toast}
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
      <div className="container max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-5 text-center border-b border-border">
        <Link to="/" className="inline-block">
          <h1 className="font-headline text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Shared Ground
          </h1>
          <p className="body-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Global Feminist News & Analysis
          </p>
        </Link>
      </div>

      {/* Navigation — desktop */}
      <nav className="hidden md:block container max-w-[1400px] mx-auto px-6">
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

      {/* Navigation — mobile overlay (absolute, floats over page content) */}
      {menuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
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
    </header>
    {/* Backdrop — closes menu on tap outside */}
    {menuOpen && (
      <div
        className="fixed inset-0 z-40 md:hidden"
        onClick={() => setMenuOpen(false)}
      />
    )}
    </>
  );
};

export default Navbar;
