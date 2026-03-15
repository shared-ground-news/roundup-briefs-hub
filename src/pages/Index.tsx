import { useState, useCallback, useEffect } from "react";
import Masthead from "@/components/Masthead";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";
import SiteFooter from "@/components/SiteFooter";
import ContactModal from "@/components/ContactModal";
import Sidebar from "@/components/Sidebar";
import ScrapingLogicPage from "@/components/ScrapingLogicPage";
import AboutPage from "@/components/AboutPage";
import ImprintPage from "@/components/ImprintPage";
import ScrollButtons from "@/components/ScrollButton";
import NewsletterModal from "@/components/NewsletterModal";
import { useArticles } from "@/hooks/useArticles";
import { SOURCES_BY_LOCALE, type Locale } from "@/lib/constants";
import { TRANSLATIONS } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";

interface IndexProps {
  locale: Locale;
}

const Index = ({ locale }: IndexProps) => {
  const t = TRANSLATIONS[locale];
  const { setLocale } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
  const [showImprint, setShowImprint] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrapingLogic, setShowScrapingLogic] = useState(false);

  // Keep AuthContext locale in sync so OnboardingModal uses the right language
  useEffect(() => { setLocale(locale); }, [locale, setLocale]);

  const {
    articles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    isFiltered,
    isGrouped,
    clearFilters,
    page,
    setPage,
    totalPages,
    totalCount,
  } = useArticles(locale);

  // "See all" in grouped sections → switch to filtered view for that topic
  const handleTopicClick = useCallback(
    (topic: string) => {
      setFilters((f) => ({ ...f, selectedTopics: [topic] }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setFilters]
  );

  const handleAboutToggle = () => {
    setShowAbout((v) => !v);
    setShowImprint(false);
    setShowScrapingLogic(false);
  };

  const handleImprintOpen = () => {
    setShowImprint(true);
    setShowAbout(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImprintClose = () => {
    setShowImprint(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        locale={locale}
        t={t}
        onAboutToggle={handleAboutToggle}
        onNewsletterClick={() => setNewsletterOpen(true)}
        onContactClick={() => setContactOpen(true)}
        onScrapingLogicClick={() => { setShowScrapingLogic(true); setShowAbout(false); setShowImprint(false); }}
      />

      {/* Main content — shifts right on desktop to make room for fixed sidebar */}
      <div className="flex-1 min-w-0 lg:pl-60">
        <Masthead
          stats={stats}
          showAbout={showAbout}
          onAboutToggle={handleAboutToggle}
          locale={locale}
          t={t}
          onNewsletterClick={() => setNewsletterOpen(true)}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />

        {showImprint ? (
          <ImprintPage onClose={handleImprintClose} />
        ) : showScrapingLogic ? (
          <ScrapingLogicPage onClose={() => setShowScrapingLogic(false)} />
        ) : showAbout ? (
          <AboutPage />
        ) : (
          <>
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              localeSources={SOURCES_BY_LOCALE[locale]}
              articleCount={articles.length}
              totalCount={totalCount}
              isFiltered={isFiltered}
              clearFilters={clearFilters}
              locale={locale}
              t={t}
            />
            <div className="pt-4 pb-8">
              <ArticleGrid
                articles={articles}
                loading={loading}
                error={error}
                isFiltered={isFiltered}
                isGrouped={isGrouped}
                clearFilters={clearFilters}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                onTopicClick={handleTopicClick}
                t={t}
              />
            </div>
          </>
        )}

        <SiteFooter
          onNewsletterClick={() => setNewsletterOpen(true)}
          onContactClick={() => setContactOpen(true)}
          t={t}
        />

        {/* Impressum link — fixed at very bottom */}
        <div className="w-full text-center py-3 border-t border-border bg-background">
          <button
            onClick={handleImprintOpen}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Impressum / Imprint
          </button>
        </div>
      </div>

      <ScrollButtons />

      <NewsletterModal
        open={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        locale={locale}
      />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        t={t}
      />
    </div>
  );
};

export default Index;
