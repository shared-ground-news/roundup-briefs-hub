import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronRight, Newspaper, Globe, Mail, MessageSquare, Info } from "lucide-react";
import { type Locale } from "@/lib/constants";
import { type Translations } from "@/lib/translations";

// ── Source lists (moved from AboutPage) ───────────────────────────────────────

const EN_SOURCES_GROUPED = {
  "general news (keyword-filtered)": [
    "BBC News", "BBC News World", "The Guardian", "Reuters", "Reuters World",
    "Al Jazeera", "NPR News", "The Independent", "HuffPost", "New York Times 🔒",
    "Associated Press", "CNN World", "Washington Post 🔒", "Financial Times 🔒",
    "CBC News World", "ABC News", "SBS News World", "Le Monde", "IPS News Agency",
    "The Conversation", "Global Voices", "Fair Observer",
  ],
  "women & feminist (all articles)": [
    "The Guardian Women", "Ms. Magazine", "Feministing", "Jezebel",
    "Refinery29 Feminism", "The Funambulist",
  ],
  "LGBTQIA+ (all articles)": [
    "Gay Times", "PinkNews", "Out Magazine", "LGBTQ Nation", "Advocate",
    "Autostraddle", "Them", "Queerty", "Xtra Magazine",
  ],
  "progressive & investigative (keyword-filtered)": [
    "AlterNet", "Democracy Now", "FSRN", "Jewish Voice for Peace",
    "Le Monde Diplomatique", "The Progressive", "Reveal News",
    "Accuracy in Media", "Media Matters",
  ],
};

const DE_SOURCES_GROUPED = {
  "general news (keyword-filtered)": [
    "Der Spiegel", "Die Zeit", "Süddeutsche Zeitung", "taz", "Der Tagesspiegel",
    "Frankfurter Rundschau", "t-online", "n-tv",
  ],
  "feminist & LGBTQIA+ (all articles)": [
    "LSVD", "Queer.de", "noizz.de",
  ],
  "progressive & investigative (keyword-filtered)": [
    "Jacobin DE", "Analyse & Kritik",
  ],
};

// ── Sub-component: expandable source list ─────────────────────────────────────

function SourceSection({ title, sources }: { title: string; sources: Record<string, string[]> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-3 mt-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground hover:text-foreground transition-colors w-full text-left py-0.5"
      >
        {open ? <ChevronDown className="w-3 h-3 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 flex-shrink-0" />}
        {title}
      </button>
      {open && (
        <div className="ml-4 mt-1.5 space-y-3">
          {Object.entries(sources).map(([cat, names]) => (
            <div key={cat}>
              <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/70 mb-1">{cat}</p>
              <p className="text-[0.72rem] text-muted-foreground leading-relaxed">
                {names.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Expandable "scraping logic" section ───────────────────────────────────────

function ScrapingSection() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left text-[0.78rem] text-muted-foreground hover:text-foreground transition-colors py-1.5"
      >
        <Newspaper className="w-3.5 h-3.5 flex-shrink-0" />
        <span>scraping logic</span>
        {open ? <ChevronDown className="w-3 h-3 ml-auto" /> : <ChevronRight className="w-3 h-3 ml-auto" />}
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5">
          <SourceSection title="anglophone news (43 sources)" sources={EN_SOURCES_GROUPED} />
          <SourceSection title="german news (13 sources)" sources={DE_SOURCES_GROUPED} />
        </div>
      )}
    </div>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  t: Translations;
  onAboutToggle: () => void;
  onNewsletterClick: () => void;
  onContactClick: () => void;
}

export default function Sidebar({
  open,
  onClose,
  t,
  onAboutToggle,
  onNewsletterClick,
  onContactClick,
}: SidebarProps) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const navItem = (icon: React.ReactNode, label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full text-left text-[0.78rem] text-muted-foreground hover:text-foreground transition-colors py-1.5"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const inner = (
    <div className="flex flex-col h-full bg-card border-r border-border w-60 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <span className="font-serif-display text-base font-bold tracking-tight">shared ground</span>
        <button
          onClick={onClose}
          aria-label="close sidebar"
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="border-b border-border pb-3 mb-3">
          <ScrapingSection />
        </div>

        <div className="space-y-0.5">
          {navItem(<Info className="w-3.5 h-3.5 flex-shrink-0" />, "mission", () => { onAboutToggle(); onClose(); })}
          {navItem(<MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />, t.contactUs, () => { onContactClick(); onClose(); })}
          {navItem(<Mail className="w-3.5 h-3.5 flex-shrink-0" />, t.getNewsletter, () => { onNewsletterClick(); onClose(); })}
          {navItem(<Globe className="w-3.5 h-3.5 flex-shrink-0" />, "roundup-briefs-hub.pages.dev", () => window.open("https://roundup-briefs-hub.pages.dev", "_blank"))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <p className="text-[0.65rem] text-muted-foreground leading-relaxed">
          built by Valeria Pinto &amp; Alexandra Brandl
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40 w-60">
        {inner}
      </div>

      {/* Mobile: overlay drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative h-full">
            {inner}
          </div>
        </div>
      )}
    </>
  );
}
