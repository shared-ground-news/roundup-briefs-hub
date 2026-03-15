import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOPIC_SLUGS } from "@/lib/constants";
import { TRANSLATIONS, type Locale } from "@/lib/translations";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}

const LOCALE_OPTIONS: Array<{ value: "en" | "de" | "both"; labelKey: "languageEnOnly" | "languageDeOnly" | "languageBoth" }> = [
  { value: "en",   labelKey: "languageEnOnly" },
  { value: "de",   labelKey: "languageDeOnly" },
  { value: "both", labelKey: "languageBoth"   },
];

export default function NewsletterModal({ open, onClose, locale }: NewsletterModalProps) {
  const t = TRANSLATIONS[locale];
  const { subscribe, isLoading, isSuccess, reset } = useNewsletterSubscription();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedLocale, setSelectedLocale] = useState<"en" | "de" | "both">("both");

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setTimeout(() => {
        setEmail("");
        setEmailError("");
        setSelectedSlugs([]);
        setSelectedLocale("both");
        reset();
      }, 200);
      onClose();
    }
  };

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email.includes("@")) {
      setEmailError("please enter a valid email address.");
      return;
    }
    await subscribe({ email, topicSlugs: selectedSlugs, localePreference: selectedLocale });
  };

  const topicEntries = Object.entries(TOPIC_SLUGS);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{t.newsletter}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.newsletterIntro}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-3xl">📬</p>
            <p className="font-semibold">{t.subscribeSuccess}</p>
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="mt-2">
              {t.back.replace("← ", "")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            {/* Email */}
            <div className="space-y-1.5">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            {/* Topics */}
            <div className="space-y-2">
              <p className="text-sm font-medium">{t.chooseTopics}</p>
              <div className="flex flex-wrap gap-2">
                {topicEntries.map(([slug, info]) => {
                  const label = locale === "de" ? info.de : info.en;
                  const active = selectedSlugs.includes(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => toggleSlug(slug)}
                      className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors select-none ${
                        active
                          ? "bg-chip-active text-chip-active-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-border"
                      }`}
                    >
                      {info.emoji} {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <p className="text-sm font-medium">{t.chooseLanguage}</p>
              <div className="flex items-center rounded-sm border border-border overflow-hidden">
                {LOCALE_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedLocale(opt.value)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap select-none ${
                      i > 0 ? "border-l border-border" : ""
                    } ${
                      selectedLocale === opt.value
                        ? "bg-chip-active text-chip-active-foreground"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {t[opt.labelKey]}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "…" : t.subscribeButton}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
