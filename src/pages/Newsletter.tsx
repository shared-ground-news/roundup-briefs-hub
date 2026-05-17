import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";
import { Mail, CalendarDays, Globe, Sparkles } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, isSuccess, error } = useNewsletterSubscription();

  const status = isSuccess ? "success" : isLoading ? "loading" : error ? "error" : "idle";
  const errorMsg = error ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await subscribe({
      email,
      topicSlugs: [],          // empty = all topics by default
      localePreference: "de",  // can be toggled later
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#7c3aed]">
        <div className="container max-w-[1400px] mx-auto px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50 mb-4">
            Jeden Sonntag
          </p>
          <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight text-white">
            Die Woche im Rückblick.
            <br />
            <span className="text-white/60">Direkt in dein Postfach.</span>
          </h2>
          <p className="text-base text-white/75 max-w-xl mx-auto leading-relaxed">
            Jede Woche kuratieren wir die wichtigsten Nachrichten zu Feminismus,
            Frauenrechten und LGBTQIA+-Themen aus dem deutschsprachigen Raum —
            kompakt, kostenlos, ohne Algorithmus.
          </p>
        </div>
      </div>

      <main className="container max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-12 gap-12">

          {/* Left — benefits */}
          <div className="col-span-5">
            <h3 className="headline-lg mb-8">Was dich erwartet</h3>
            <div className="space-y-6">
              {[
                {
                  icon: CalendarDays,
                  title: "Jeden Sonntag",
                  desc: "Pünktlich zum Wochenende — kein täglicher Lärm, nur das Wesentliche.",
                },
                {
                  icon: Globe,
                  title: "DACH-Perspektive",
                  desc: "Artikel aus über 40 deutschsprachigen Medien, gefiltert nach Relevanz.",
                },
                {
                  icon: Sparkles,
                  title: "Kuratiert, nicht generiert",
                  desc: "Kein KI-Brei. Wir lesen, filtern und wählen aus — für euch.",
                },
                {
                  icon: Mail,
                  title: "Kostenlos & werbefrei",
                  desc: "Kein Abo, keine Paywall, keine nervigen Anzeigen. Versprochen.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-sm border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — signup form */}
          <div className="col-span-7 flex items-start">
            <div className="w-full border border-border rounded-sm p-10">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center mx-auto mb-5">
                    <Mail size={20} className="text-primary-foreground" />
                  </div>
                  <h4 className="headline-lg mb-2">Du bist dabei 🎉</h4>
                  <p className="text-sm text-muted-foreground">
                    Schön, dass du dabei bist! Den ersten Newsletter bekommst du am nächsten Sonntag.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="headline-lg mb-2">Jetzt anmelden</h4>
                  <p className="text-sm text-muted-foreground mb-8">
                    Trag deine E-Mail ein — du kannst dich jederzeit wieder abmelden.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        E-Mail-Adresse
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="deine@email.de"
                        className="w-full border border-border rounded-sm px-4 py-3 text-sm bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-xs text-red-500">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-foreground text-primary-foreground py-3 px-6 text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50 rounded-sm"
                    >
                      {status === "loading" ? "Wird angemeldet…" : "Anmelden"}
                    </button>
                  </form>

                  <p className="text-[11px] text-muted-foreground/50 mt-5 leading-relaxed">
                    Kein Spam. Nur der Shared Ground Newsletter, jeden Sonntag.
                    Abmeldung jederzeit mit einem Klick möglich.
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;
