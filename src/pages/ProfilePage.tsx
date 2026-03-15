import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useFollowedTopics } from "@/hooks/useFollowedTopics";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";
import OnboardingModal from "@/components/OnboardingModal";
import { TOPIC_SLUGS, type Locale } from "@/lib/constants";
import { TRANSLATIONS } from "@/lib/translations";

interface ProfilePageProps {
  locale: Locale;
}

const LOCALE_OPTIONS: Array<{ value: "en" | "de" | "both"; labelKey: "languageEnOnly" | "languageDeOnly" | "languageBoth" }> = [
  { value: "en",   labelKey: "languageEnOnly" },
  { value: "de",   labelKey: "languageDeOnly" },
  { value: "both", labelKey: "languageBoth"   },
];

export default function ProfilePage({ locale }: ProfilePageProps) {
  const t = TRANSLATIONS[locale];
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { followedSlugs, localePreference, unfollowTopic } = useFollowedTopics();
  const { savedArticles, isLoading: savedLoading } = useSavedArticles();
  const { subscribe, isLoading: subLoading, isSuccess: subSuccess } = useNewsletterSubscription();

  const [editOpen, setEditOpen] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlEmailError, setNlEmailError] = useState("");
  const [nlLocale, setNlLocale] = useState<"en" | "de" | "both">("both");

  const backHref = `/${locale}`;

  // Redirect if not logged in (after auth resolves)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(backHref, { replace: true });
    }
  }, [authLoading, user, navigate, backHref]);

  const handleSignOut = async () => {
    await signOut();
    navigate(backHref);
  };

  const handleNlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNlEmailError("");
    if (!nlEmail.includes("@")) {
      setNlEmailError("please enter a valid email address.");
      return;
    }
    await subscribe({ email: nlEmail, topicSlugs: followedSlugs, localePreference: nlLocale });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to={backHref}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">{t.profile}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

        {/* ── Your topics ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.followedTopics}
            </h2>
            <button
              onClick={() => setEditOpen(true)}
              className="text-xs text-primary hover:underline"
            >
              {t.editPreferences}
            </button>
          </div>

          {followedSlugs.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noFollowedTopics}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {followedSlugs.map((slug) => {
                const info = TOPIC_SLUGS[slug];
                if (!info) return null;
                const label = locale === "de" ? info.de : info.en;
                return (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-chip-active text-chip-active-foreground rounded-sm text-xs font-medium"
                  >
                    {info.emoji} {label}
                    <button
                      onClick={() => unfollowTopic(slug)}
                      aria-label={`Unfollow ${label}`}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Saved articles ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            saved articles
          </h2>
          {savedLoading ? (
            <p className="text-sm text-muted-foreground">loading…</p>
          ) : (
            <p className="text-sm">
              {savedArticles.length > 0 ? (
                <>
                  {savedArticles.length} saved ·{" "}
                  <Link
                    to={`/${locale}/saved`}
                    className="text-primary underline underline-offset-2"
                  >
                    view saved articles →
                  </Link>
                </>
              ) : (
                <span className="text-muted-foreground">nothing saved yet.</span>
              )}
            </p>
          )}
        </section>

        {/* ── Newsletter ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.newsletter}
          </h2>

          {subSuccess ? (
            <p className="text-sm text-foreground">{t.subscribeSuccess}</p>
          ) : (
            <form onSubmit={handleNlSubmit} className="space-y-3">
              <p className="text-sm text-muted-foreground">{t.newsletterIntro}</p>
              <Input
                type="email"
                placeholder="your@email.com"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                required
              />
              {nlEmailError && (
                <p className="text-xs text-destructive">{nlEmailError}</p>
              )}
              <div className="flex items-center rounded-sm border border-border overflow-hidden">
                {LOCALE_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNlLocale(opt.value)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap select-none ${
                      i > 0 ? "border-l border-border" : ""
                    } ${
                      nlLocale === opt.value
                        ? "bg-chip-active text-chip-active-foreground"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {t[opt.labelKey]}
                  </button>
                ))}
              </div>
              <Button type="submit" disabled={subLoading} size="sm">
                {subLoading ? "…" : t.subscribeButton}
              </Button>
            </form>
          )}
        </section>

        {/* ── Account ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            account
          </h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            {t.signOut}
          </Button>
        </section>
      </div>

      {/* Edit preferences modal — pre-filled with current prefs */}
      <OnboardingModal
        open={editOpen}
        onDismiss={() => setEditOpen(false)}
        locale={locale}
        initialSlugs={followedSlugs}
        initialLocale={localePreference}
      />
    </div>
  );
}
