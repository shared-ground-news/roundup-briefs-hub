import { Link } from "react-router-dom";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { TOPICS } from "@/lib/constants";

// Beschreibungen für die neuen Systemkategorien
const THEMEN_BESCHREIBUNGEN: Record<string, string> = {
  "Anti-Rights & Backlash Movements":
    "Organisierte Bewegungen und Gesetze, die bestehende Rechte von Minderheiten abbauen wollen — von Trans-Verboten bis zu Anti-LGBTQIA+-Gesetzgebung.",
  "Bodily Autonomy & Reproductive Justice":
    "Kontrolle über den eigenen Körper: Abtreibungsrechte, reproduktive Gesundheit, FGM, körperliche Unversehrtheit und medizinische Entscheidungsfreiheit.",
  "Violence, Safety & Criminal Justice":
    "Staatliche und nicht-staatliche Gewalt, Femizid, häusliche Gewalt, Straffreiheit und der Umgang von Justizsystemen mit Minderheiten.",
  "State Power, Law & Governance":
    "Wie rechtliche und politische Systeme Rechte verteilen oder verweigern — Gerichtsurteile, Gesetze, Wahlen und institutionelle Macht.",
  "Economic & Labour Justice":
    "Wer verdient, besitzt, erbt und sorgt — und wer nicht. Lohnlücke, Care-Arbeit, Gewerkschaften, Mutterschaftsrechte.",
  "Migration, Borders & Citizenship":
    "Bewegungsfreiheit, Zugehörigkeit, Staatenlosigkeit, Abschiebung und die Rechte von Menschen auf der Flucht.",
  "Climate & Environmental Justice":
    "Wer trägt die Kosten des Klimawandels? Land- und Wasserrechte, Vertreibung, Umweltrassismus.",
  "Technology & Digital Power":
    "Überwachung, Zensur, algorithmische Diskriminierung, Deepfakes und digitale Gewalt gegen Frauen und Minderheiten.",
  "Culture, Media & Narrative Power":
    "Wer kontrolliert Geschichten? Repräsentation, Zensur, Buchverbote, Pressefreiheit und Bildungspolitik.",
};

const ThemenPage = () => {
  // Filter out "All Topics"
  const themen = TOPICS.filter((t) => t.label !== "All Topics");

  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <main className="max-w-[1100px] mx-auto px-4 py-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-8 font-sans">
          Themen
        </h2>
        <p className="text-[0.95rem] text-muted-foreground font-sans mb-10 max-w-[600px]">
          shared ground strukturiert Nachrichten nach Machtsystemen — nicht nach Identitäten.
          Klicke auf ein Thema, um den gefilterten Feed zu öffnen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themen.map((thema) => (
            <Link
              key={thema.label}
              to={`/de?topic=${encodeURIComponent(thema.label)}`}
              className="group block border border-border rounded-sm p-5 hover:border-foreground transition-colors bg-background"
            >
              <div className="text-3xl mb-3">{thema.emoji}</div>
              <h3 className="font-serif-display text-base font-semibold text-foreground mb-2 group-hover:underline underline-offset-2 leading-snug">
                {thema.label}
              </h3>
              {THEMEN_BESCHREIBUNGEN[thema.label] && (
                <p className="text-[0.8rem] text-muted-foreground font-sans leading-relaxed">
                  {THEMEN_BESCHREIBUNGEN[thema.label]}
                </p>
              )}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ThemenPage;
