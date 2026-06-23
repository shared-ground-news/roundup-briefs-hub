import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Bookmark, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Home", path: "/de" },
  { label: "Podcasts", path: "/podcasts" },
  { label: "Newsletter", path: "/newsletter" },
  { label: "About", path: "/about" },
  { label: "Saved", path: "/saved" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, requireAuth, signOut } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="w-full border-b border-border bg-background sticky top-0 z-50">
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

      {/* Navigation — mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background">
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
  );
};

export default Navbar;
