import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-[1400px] mx-auto px-6 py-8">
      <h2 className="headline-xl mb-10">Kontakt</h2>

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

        {/* Divider */}
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
            <p className="body-sm font-semibold mb-1">Haftungsausschluss</p>
            <p className="body-sm text-muted-foreground leading-relaxed">
              shared ground aggregiert Artikel aus externen RSS-Feeds und ist nicht
              verantwortlich für den Inhalt verlinkter Seiten. Die jeweiligen Betreiber
              sind allein verantwortlich für den Inhalt ihrer Seiten.
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
