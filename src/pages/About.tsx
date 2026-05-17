import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, Cpu, BookOpen, Rss } from "lucide-react";

const SOURCE_GROUPS = [
  {
    country: "Deutschland",
    flag: "🇩🇪",
    sources: [
      "Spiegel Online", "Zeit Online", "FAZ", "Süddeutsche Zeitung",
      "Die Welt", "Tagesspiegel", "Tagesschau", "ZDF heute",
      "Deutschlandfunk", "BR24", "MDR Nachrichten", "NDR Nachrichten",
      "Focus Online", "taz", "Freitag", "EMMA", "queer.de", "L-MAG",
    ],
  },
  {
    country: "Österreich",
    flag: "🇦🇹",
    sources: [
      "Der Standard", "ORF News", "Die Presse", "Kurier", "Kleine Zeitung",
      "profil", "Falter", "Moment", "Wiener Zeitung", "APA OTS",
    ],
  },
  {
    country: "Schweiz",
    flag: "🇨🇭",
    sources: [
      "NZZ", "SRF News", "Tages-Anzeiger", "20 Minuten", "Blick",
      "Watson", "Republik", "Infosperber",
    ],
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-[1400px] mx-auto px-6 py-8">
        <h2 className="headline-xl mb-6">About Shared Ground</h2>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-8">
            <p className="body-lg text-muted-foreground mb-6">
              Shared Ground ist ein feministischer News-Aggregator, der Artikel aus
              deutschsprachigen Medien kuratiert und nach Relevanz für Geschlechtergleichstellung,
              LGBTQIA+-Themen und Frauenrechte filtert.
            </p>

            <div className="editorial-divider-thin my-8" />

            <h3 className="headline-lg mb-4">So funktioniert die Kuratierung</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                {
                  icon: Rss,
                  title: "RSS-Feeds",
                  desc: "Wir lesen RSS-Feeds von über 40 deutschsprachigen Medien aus Deutschland, Österreich und der Schweiz.",
                },
                {
                  icon: Globe,
                  title: "Keyword-Filterung",
                  desc: "Artikel werden anhand von Schlüsselwörtern gefiltert — von Feminismus über Lohngleichheit bis LGBTQIA+-Rechte.",
                },
                {
                  icon: Cpu,
                  title: "Automatische Aktualisierung",
                  desc: "Die Inhalte werden alle 12 Stunden automatisch aktualisiert, sodass du immer die neuesten Artikel siehst.",
                },
                {
                  icon: BookOpen,
                  title: "Themen-Clustering",
                  desc: "Artikel werden nach Themen gruppiert — Politik, Kultur, Wirtschaft und Sport — für eine übersichtliche Navigation.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 bg-card border border-border rounded-sm">
                  <Icon size={24} className="text-accent-blue mb-3" />
                  <h4 className="headline-sm mb-2">{title}</h4>
                  <p className="body-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <div className="editorial-divider-thin my-8" />

            <h3 className="headline-lg mb-2">Unsere Quellen</h3>
            <p className="body-md text-muted-foreground mb-6">
              Wir aggregieren Inhalte aus {SOURCE_GROUPS.reduce((acc, g) => acc + g.sources.length, 0)} deutschsprachigen
              Medien im DACH-Raum.
            </p>

            <div className="space-y-6">
              {SOURCE_GROUPS.map((group) => (
                <div key={group.country}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{group.flag}</span>
                    <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {group.country}
                    </h4>
                    <span className="text-xs text-muted-foreground/60">
                      ({group.sources.length} Quellen)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.sources.map((source) => (
                      <span
                        key={source}
                        className="px-3 py-1 text-xs font-medium bg-card border border-border rounded-sm text-foreground/80 hover:border-foreground/30 transition-colors"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-foreground text-primary-foreground p-6 rounded-sm mb-6">
              <h4 className="font-headline text-xl font-bold mb-3">Unsere Mission</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Feministische Nachrichten zugänglich, auffindbar und wirkungsvoll zu machen —
                indem wir Leserinnen mit den wichtigsten Geschichten verbinden, quer durch
                Länder und Perspektiven.
              </p>
            </div>

            <div className="border border-border rounded-sm p-6">
              <h4 className="headline-md mb-4">Auf einen Blick</h4>
              <div className="space-y-4">
                {[
                  { number: "40+", label: "Medien im DACH-Raum" },
                  { number: "3", label: "Länder: DE, AT, CH" },
                  { number: "12h", label: "Aktualisierungsintervall" },
                  { number: "4", label: "Kuratierte Podcasts" },
                ].map(({ number, label }) => (
                  <div key={label} className="flex items-baseline gap-3">
                    <span className="text-3xl font-headline font-black text-accent-blue">{number}</span>
                    <span className="body-sm text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 border border-border rounded-sm">
              <h4 className="headline-sm mb-2">Kontakt</h4>
              <p className="body-sm text-muted-foreground">
                Quellen-Vorschläge oder Feedback? Schreib uns an{" "}
                <span className="text-accent-blue font-medium">hello@sharedground.news</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
