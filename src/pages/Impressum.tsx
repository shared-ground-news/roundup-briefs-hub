import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Impressum = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container max-w-[1400px] mx-auto px-6 py-8">
      <div className="editorial-divider mb-4" />
      <h2 className="headline-xl mb-10">Impressum</h2>

      <div className="max-w-md">
        <p className="body-sm text-muted-foreground leading-relaxed">
          Das Impressum wird in Kürze ergänzt.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Impressum;
