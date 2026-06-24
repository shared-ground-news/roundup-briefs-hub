import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Impressum = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <h2 className="headline-xl mb-10">Impressum</h2>

      <div className="max-w-md space-y-8">
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
    </main>
    <Footer />
  </div>
);

export default Impressum;
