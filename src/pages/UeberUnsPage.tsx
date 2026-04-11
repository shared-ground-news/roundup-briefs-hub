import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";

const QUELLEN_NACH_LAND: Record<string, string[]> = {
  "Deutschland": [
    "Spiegel Online", "Zeit Online", "FAZ", "Sueddeutsche Zeitung", "Die Welt",
    "Tagesspiegel", "Focus Online", "Tagesschau", "ZDF heute", "Deutschlandfunk",
    "BR24", "MDR Nachrichten", "NDR Nachrichten", "taz", "Freitag",
    "EMMA", "queer.de", "L-MAG",
  ],
  "Österreich": [
    "Der Standard", "ORF News", "Die Presse", "Kurier AT", "Kleine Zeitung",
    "profil AT", "Falter AT", "News AT", "Moment AT", "Vienna AT",
    "Wienerin", "Wiener Zeitung", "APA OTS",
  ],
  "Schweiz": [
    "NZZ", "SRF News", "Tages-Anzeiger", "20 Minuten CH", "Blick CH",
    "Watson CH", "Aargauer Zeitung", "Basler Zeitung", "Der Bund CH",
    "RTS Info", "Le Temps", "Tribune de Geneve", "Swissinfo EN",
    "Infosperber CH", "Republik CH",
  ],
  "Spanien": [
    "El Pais", "El Mundo", "La Vanguardia", "El Confidencial", "elDiario.es",
    "20minutos ES", "Publico ES", "El Periodico", "RTVE Noticias", "El Espanol",
    "Cadena SER", "infoLibre", "ABC Espana", "El Huffpost ES", "Mujeres en Red",
  ],
  "Italien": [
    "La Repubblica", "Corriere della Sera", "ANSA", "Il Fatto Quotidiano",
    "Il Sole 24 Ore", "HuffPost Italia", "TGcom24", "Sky TG24", "Fanpage IT",
    "Open Online", "Il Manifesto", "Internazionale", "AGI", "Rainews", "La Stampa",
  ],
  "USA": [
    "NPR", "Reuters", "The Guardian US", "New York Times", "CNN", "NBC News",
    "CBS News", "ABC News US", "Vox", "The Atlantic", "Politico",
    "Ms. Magazine", "Human Rights Watch", "ACLU News", "Teen Vogue",
  ],
  "China": [
    "CGTN", "Global Times", "South China Morning Post", "China Daily",
    "Sixth Tone", "ChinaFile", "What's on Weibo", "Radii China",
    "Hong Kong Free Press", "Taiwan News", "Caixin Global",
    "Xinhua English", "People's Daily EN", "SupChina", "China Digital Times",
  ],
  "Uganda": [
    "Daily Monitor UG", "New Vision UG", "Observer Uganda", "Nile Post",
    "Chimp Reports", "The Independent UG", "Softpower Uganda", "URN Uganda",
    "Kampala Post", "African Arguments UG", "Bukedde", "NTV Uganda",
    "Kool FM Uganda", "Eagle Online UG", "The Tower Post UG",
  ],
  "Finnland": [
    "Yle News EN", "Yle Uutiset FI", "Helsingin Sanomat", "Iltalehti",
    "Ilta-Sanomat", "MTV Uutiset", "Kauppalehti", "Uusi Suomi", "Aamulehti",
    "Turun Sanomat", "Vihrea Lanka", "Maaseudun Tulevaisuus",
    "Savon Sanomat", "Kaleva FI", "Taloussanomat",
  ],
  "Türkei": [
    "Hurriyet Daily News", "Daily Sabah", "Bianet EN", "Anadolu Agency EN",
    "Cumhuriyet", "Hurriyet TR", "Milliyet", "Sabah TR", "BirGun",
    "Gazete Duvar", "T24 TR", "Sozcu", "Haberturk", "Bianet TR", "Karar TR",
  ],
  "Iran": [
    "Tehran Times", "Iran International", "IranWire", "IRNA English",
    "Press TV", "Financial Tribune", "Iran Front Page", "Kayhan London",
    "Iran Human Rights", "Radio Farda EN", "BBC Persian", "VOA Persian",
    "Manoto News", "Iran Wire FA", "Zan Iran",
  ],
  "Südafrika": [
    "Mail and Guardian", "Daily Maverick", "TimesLive", "News24",
    "The Citizen ZA", "IOL ZA", "GroundUp", "Bhekisisa", "Eyewitness News",
    "Maverick Citizen", "The South African", "Business Day ZA",
    "African Arguments ZA", "Daily Sun ZA", "Feminist SA",
  ],
  "Indien": [
    "The Hindu", "Times of India", "NDTV", "Indian Express", "Hindustan Times",
    "The Wire IN", "Scroll.in", "The Print", "Feminism in India", "LiveMint",
    "The Quint", "Outlook India", "News Laundry", "The Caravan IN", "Tribune India",
  ],
};

const KEYWORDS = {
  "Frauen & Feminismus": [
    "Frauen", "Frau", "Feminismus", "Gleichstellung", "Lohnlücke",
    "reproduktive Rechte", "Abtreibung", "Frauenrechte", "Sexismus",
    "Misogynie", "Patriarchat", "Periodenarmut", "Frauengesundheit",
    "häusliche Gewalt", "sexuelle Belästigung", "Femizid", "Elternzeit",
    "körperliche Selbstbestimmung", "Verhütung", "IVF",
  ],
  "LGBTQIA+": [
    "LGBT", "queer", "schwul", "lesbisch", "bisexuell", "transgender",
    "trans", "nicht-binär", "intersexuell", "asexuell", "Pride",
    "Coming Out", "Homo-Ehe", "Trans-Rechte", "Homophobie", "Transphobie",
    "Pronomen", "Drag Queen", "Diskriminierung", "Gleichheit",
    "Gerechtigkeit", "Aktivismus",
  ],
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-4 mt-10 font-sans">
    {children}
  </h2>
);

const UeberUnsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <main className="max-w-[700px] mx-auto px-4 py-8 font-sans">

        <SectionHeading>Unsere Vision</SectionHeading>
        <p className="text-[0.95rem] text-foreground leading-relaxed mb-4">
          Nachrichten über Feminismus, Frauenrechte und queere Themen landen
          selten auf den Titelseiten. Sie erscheinen, werden kurz geteilt —
          und verschwinden wieder. Nicht weil sie unwichtig sind, sondern weil
          die Strukturen des Mediensystems sie an den Rand drängen.
        </p>
        <p className="text-[0.95rem] text-foreground leading-relaxed mb-4">
          <strong>shared ground</strong> ist unsere Antwort darauf. Wir
          aggregieren Berichterstattung aus dem deutschsprachigen Raum,
          die sonst untergeht — und machen sie an einem Ort sichtbar,
          zugänglich und durchsuchbar. Kostenlos. Unabhängig. Für alle.
        </p>
        <p className="text-[0.95rem] text-foreground leading-relaxed">
          Wir glauben, dass informierte Menschen die Welt verändern.
          Und dass der erste Schritt dazu ist, die richtigen Informationen
          überhaupt zu finden.
        </p>

        <SectionHeading>Was wir sind</SectionHeading>
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-4">
          shared ground ist ein unabhängiger Nachrichtenaggregator — keine
          Redaktion, kein eigener Journalismus. Wir kuratieren, was andere
          schreiben. Wir kommentieren nicht, wir wählen nicht aus nach
          Meinung — wir scrapen RSS-Feeds alle 12 Stunden und filtern nach
          Keywords, die für unsere Community relevant sind.
        </p>
        <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
          Alle Artikel bleiben bei ihren Originalquellen. Wir verlinken immer
          direkt dorthin. Paywalled-Inhalte erscheinen möglicherweise nicht.
        </p>

        <SectionHeading>Unsere Quellen</SectionHeading>
        {Object.entries(QUELLEN_NACH_LAND).map(([land, quellen]) => (
          <div key={land} className="mb-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
              {land}
            </p>
            <p className="text-[0.9rem] text-foreground leading-relaxed">
              {quellen.join(" · ")}
            </p>
          </div>
        ))}

        <SectionHeading>Keywords</SectionHeading>
        <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-6">
          Allgemeine Nachrichtenquellen werden nur aufgenommen wenn sie
          mindestens eines dieser Keywords enthalten.
        </p>
        {Object.entries(KEYWORDS).map(([kategorie, woerter]) => (
          <div key={kategorie} className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              {kategorie}
            </p>
            <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
              {woerter.join(", ")}
            </p>
          </div>
        ))}

        <SectionHeading>Kontakt</SectionHeading>
        <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
          Fragen, Feedback oder Quellenvorschläge?{" "}
          <a
            href="mailto:valeriacharlottepinto@gmail.com"
            className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            Schreib uns.
          </a>
        </p>

        <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4">
          shared ground · Aktualisierung alle 12 Stunden · Unabhängig & kostenlos
        </p>

      </main>
      <SiteFooter />
    </div>
  );
};

export default UeberUnsPage;
