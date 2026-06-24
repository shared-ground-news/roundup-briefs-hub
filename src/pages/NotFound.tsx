import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-headline font-black text-foreground">404</h1>
          <p className="mb-6 text-lg text-muted-foreground">Diese Seite existiert nicht.</p>
          <Link to="/de" className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity">
            Zurück zum News Feed
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
