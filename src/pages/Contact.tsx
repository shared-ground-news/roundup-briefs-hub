import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-[1400px] mx-auto px-6 py-8">
      <h2 className="headline-xl mb-10">Kontakt &amp; Impressum</h2>

      <div className="max-w-md space-y-12">

        {/* Contact */}
        <div>
          <p className="body-md text-muted-foreground mb-6 leading-relaxed">
            Shared Ground ist ein unabhängiges Projekt. Für Feedback, Quellenvorschläge
            oder Kooperationsanfragen freuen wir uns über eine Nachricht.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-muted-foreground flex-shrink-0" />
              <a
                href="mailto:sharedgroundnews@gmail.com"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                sharedgroundnews@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground/80">Berlin, Deutschland</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Impressum */}
        <div className="space-y-6">
          <h3 className="body-sm font-semibold uppercase tracking-wider text-muted-foreground">Impressum</h3>

          <div>
            <p className="body-sm font-semibold mb-1">Angaben gemäß § 5 TMG</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Valeria Pinto &amp; Alexandra Brandl<br />
              10119 Berlin<br />
              Deutschland
            </p>
          </div>

          <div>
            <p className="body-sm font-semibold mb-1">Kontakt</p>
            <p className="body-sm text-muted-foreground">
              E-Mail:{" "}
              <a href="mailto:sharedgroundnews@gmail.com" className="underline underline-offset-2">
                sharedgroundnews@gmail.com
              </a>
            </p>
          </div>

          <div>
            <p className="body-sm font-semibold mb-1">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Valeria Pinto &amp; Alexandra Brandl<br />
              10119 Berlin
            </p>
          </div>

          <div>
            <p className="body-sm font-semibold mb-1">Haftung für Inhalte</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
              jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
              für eigene Inhalte auf dieser Website nach den allgemeinen Gesetzen verantwortlich.
              Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
          </div>

          <div>
            <p className="body-sm font-semibold mb-1">Haftung für Links</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Shared Ground aggregiert und verlinkt auf Inhalte externer Websites Dritter,
              auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
              fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
              Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden
              wir derartige Links umgehend entfernen.
            </p>
          </div>

          <div>
            <p className="body-sm font-semibold mb-1">Urheberrecht</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die auf dieser Plattform verlinkten
              Artikel und Inhalte sind Eigentum der jeweiligen Verlage und Urheber. Shared Ground
              stellt ausschließlich Metadaten (Titel, Zusammenfassungen, Links) bereit und
              reproduziert keine vollständigen Artikel.
            </p>
          </div>

          <div>
            <p className="body-sm font-semibold mb-1">Online-Streitbeilegung</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
