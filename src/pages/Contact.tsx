import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-[1400px] mx-auto px-6 py-8">
      <div className="editorial-divider mb-4" />
      <h2 className="headline-xl mb-10">Kontakt</h2>

      <div className="max-w-md">
        <p className="body-md text-muted-foreground mb-8 leading-relaxed">
          Shared Ground ist ein unabhängiges Projekt. Für Feedback, Quellenvorschläge
          oder Kooperationsanfragen freuen wir uns über eine Nachricht.
        </p>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Mail size={15} className="text-muted-foreground flex-shrink-0" />
            <a
              href="mailto:sharedground@gmail.com"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              sharedground@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={15} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground/80">Berlin, Deutschland</span>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            Alexandra Brandl &amp; Valeria Pinto
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
