import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ScrollButton = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setShowTop(scrollY > 300);
      setShowBottom(scrollY + windowHeight < docHeight - 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  if (!showTop && !showBottom) return null;

  return (
    <div className="fixed bottom-6 right-5 flex flex-col gap-2 z-50">
      {showTop && (
        <button
          onClick={scrollToTop}
          className="w-9 h-9 rounded-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center shadow-md"
          aria-label="Nach oben"
          title="Nach oben"
        >
          <ChevronUp size={16} />
        </button>
      )}
      {showBottom && (
        <button
          onClick={scrollToBottom}
          className="w-9 h-9 rounded-sm bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center shadow-md"
          aria-label="Nach unten"
          title="Nach unten"
        >
          <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
};

export default ScrollButton;
