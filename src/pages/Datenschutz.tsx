import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Datenschutz = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-[1400px] mx-auto px-4 md:px-6 py-8">
      <div className="editorial-divider mb-4" />
      <h2 className="headline-xl mb-10">Datenschutzerklärung</h2>

      <div className="max-w-2xl space-y-8 body-sm text-foreground leading-relaxed">

        <section>
          <h3 className="font-semibold mb-2">1. Verantwortliche</h3>
          <p className="text-muted-foreground">
            Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne
            der DSGVO sind:<br />
            Valeria Pinto &amp; Alexandra Brandl<br />
            F4, 68159 Mannheim<br />
            E-Mail: <a href="mailto:sharedgroundnews@gmail.com" className="underline underline-offset-2">sharedgroundnews@gmail.com</a>
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">2. Welche Daten wir verarbeiten</h3>
          <p className="text-muted-foreground mb-3">
            <strong className="text-foreground">Ohne Registrierung:</strong> Beim
            bloßen Aufrufen der Website werden keine personenbezogenen Daten von
            uns gespeichert. Es werden keine Tracking-Cookies gesetzt und keine
            Analyse-Tools eingesetzt.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Mit Konto (optional):</strong> Wenn
            du dich registrierst oder einloggst, verarbeiten wir deine
            E-Mail-Adresse sowie gespeicherte Artikel und Themen-Präferenzen.
            Diese Daten werden ausschließlich für die Bereitstellung deines Kontos
            genutzt.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">3. Dienstleister (Auftragsverarbeiter)</h3>
          <p className="text-muted-foreground mb-2">
            Wir nutzen folgende Drittanbieter, mit denen
            Auftragsverarbeitungsverträge bestehen:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              <strong className="text-foreground">Supabase Inc.</strong> (USA) —
              Authentifizierung und Speicherung von Kontodaten. Supabase ist nach
              dem EU-US Data Privacy Framework zertifiziert.{" "}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                Datenschutzerklärung Supabase
              </a>
            </li>
            <li>
              <strong className="text-foreground">Cloudflare Inc.</strong> (USA) —
              Hosting und Auslieferung der Website. Cloudflare verarbeitet
              technisch notwendige Verbindungsdaten (IP-Adresse) zur
              Bereitstellung des Dienstes.{" "}
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                Datenschutzerklärung Cloudflare
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold mb-2">4. Inhalte Dritter (RSS-Feeds)</h3>
          <p className="text-muted-foreground">
            shared ground aggregiert Artikel aus externen RSS-Feeds. Beim Klick
            auf einen Artikel verlässt du unsere Website und rufst die jeweilige
            externe Quelle auf. Für deren Datenschutzpraktiken sind wir nicht
            verantwortlich.
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">5. Deine Rechte</h3>
          <p className="text-muted-foreground mb-2">
            Du hast jederzeit das Recht auf:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            Zur Ausübung deiner Rechte wende dich an:{" "}
            <a href="mailto:sharedgroundnews@gmail.com" className="underline underline-offset-2">
              sharedgroundnews@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">6. Beschwerderecht</h3>
          <p className="text-muted-foreground">
            Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
            beschweren. Zuständig für Baden-Württemberg ist der{" "}
            <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg
            </a>
            .
          </p>
        </section>

        <section>
          <h3 className="font-semibold mb-2">7. Änderungen dieser Erklärung</h3>
          <p className="text-muted-foreground">
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf
            anzupassen. Die jeweils aktuelle Version ist auf dieser Seite
            verfügbar. Stand: Juni 2026.
          </p>
        </section>

      </div>
    </main>
    <Footer />
  </div>
);

export default Datenschutz;
