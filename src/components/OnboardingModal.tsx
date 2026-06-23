import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TOPIC_SLUGS } from "@/lib/constants";
import { TRANSLATIONS, type Locale } from "@/lib/translations";
import { useFollowedTopics } from "@/hooks/useFollowedTopics";

interface OnboardingModalProps {
  open: boolean;
  onDismiss: () => void;
  locale?: Locale;
  initialSlugs?: string[];
  initialLocale?: "en" | "de" | "both";
}

const LOCALE_OPTIONS: Array<{ value: "en" | "de" | "both"; labelKey: "languageEnOnly" | "languageDeOnly" | "languageBoth" }> = [
  { value: "en",   labelKey: "languageEnOnly" },
  { value: "de",   labelKey: "languageDeOnly" },
  { value: "both", labelKey: "languageBoth"   },
];

export default function OnboardingModal({
  open,
  onDismiss,
  locale = "en",
  initialSlugs = [],
  initialLocale = "both",
}: OnboardingModalProps) {
  const t = TRANSLATIONS[locale];
  const { savePreferences, isSaving } = useFollowedTopics();

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const [selectedLocale, setSelectedLocale] = useState<"en" | "de" | "both">(initialLocale);

  const topicEntries = Object.entries(TOPIC_SLUGS);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSave = async () => {
    await savePreferences(selectedSlugs, selectedLocale);
    onDismiss();
  };

  const handleSkip = async () => {
    await savePreferences([], selectedLocale);
    onDismiss();
  };

  return (
    // interactOutside blocked intentionally — first-run experience
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{t.onboardingTitle}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.onboardingIntro}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
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
                    className={`px-3 py-2 rounded-sm text-xs font-medium transition-colors select-none ${
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

          <div className="flex flex-col gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? "…" : t.savePreferences}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isSaving}
              className="w-full text-muted-foreground text-xs"
            >
              {t.skipForNow}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
