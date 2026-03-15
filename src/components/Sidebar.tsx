import { useEffect } from "react";
import { X, Newspaper, Globe, Mail, MessageSquare, Info } from "lucide-react";
import { type Locale } from "@/lib/constants";
import { type Translations } from "@/lib/translations";

// ── Main Sidebar ──────────────────────────────────────────────────────────────

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  t: Translations;
  onAboutToggle: () => void;
  onNewsletterClick: () => void;
  onContactClick: () => void;
  onScrapingLogicClick: () => void;
}

export default function Sidebar({
  open,
  onClose,
  t,
  onAboutToggle,
  onNewsletterClick,
  onContactClick,
  onScrapingLogicClick,
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
          {navItem(<Newspaper className="w-3.5 h-3.5 flex-shrink-0" />, "scraping logic", () => { onScrapingLogicClick(); onClose(); })}
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
