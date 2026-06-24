import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, isSuccess, error } = useNewsletterSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await subscribe({ email });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Newsletter</p>
          <h2 className="headline-xl mb-4">Bleib auf dem Laufenden.</h2>
          <p className="body-lg text-muted-foreground mb-10">
            Trag dich ein — wir schreiben dir, wenn der Newsletter startet.
          </p>

          {isSuccess ? (
            <div className="border border-border rounded-sm p-6">
              <p className="font-semibold mb-1">Du bist auf der Liste.</p>
              <p className="text-sm text-muted-foreground">Wir melden uns, sobald es losgeht.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="flex-1 border border-border rounded-sm px-4 py-3 text-sm bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-foreground text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50 rounded-sm whitespace-nowrap"
              >
                {isLoading ? "…" : "Anmelden"}
              </button>
            </form>
          )}

          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

          <p className="text-[11px] text-muted-foreground/50 mt-4">
            Kein Spam. Abmeldung jederzeit möglich.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Newsletter;
