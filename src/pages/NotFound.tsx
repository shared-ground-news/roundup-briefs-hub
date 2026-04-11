import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center font-sans">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Seite nicht gefunden</p>
        <a href="/" className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity">
          Zur Weltkarte
        </a>
      </div>
    </div>
  );
};

export default NotFound;
