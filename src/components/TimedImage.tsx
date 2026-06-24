import { useState, useEffect, useRef } from "react";

// Shimmer while loading, solid gradient on timeout/error
const SHIMMER = "w-full h-full bg-gradient-to-r from-[hsl(30,20%,92%)] via-[hsl(30,10%,96%)] to-[hsl(30,20%,92%)] animate-pulse";
const FALLBACK = "w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)]";

interface TimedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** ms before giving up and showing gradient fallback (default 8000) */
  timeout?: number;
}

type State = "loading" | "loaded" | "failed";

const TimedImage = ({ src, alt, className, timeout = 8000 }: TimedImageProps) => {
  const [state, setState] = useState<State>(src ? "loading" : "failed");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) { setState("failed"); return; }

    setState("loading");

    // Start timeout — if image hasn't loaded by then, show fallback
    timerRef.current = setTimeout(() => {
      if (imgRef.current && !imgRef.current.complete) {
        setState("failed");
      }
    }, timeout);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [src, timeout]);

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  // No src → solid gradient immediately
  if (!src) return <div className={FALLBACK} />;

  // Timed out or errored → solid gradient
  if (state === "failed") return <div className={FALLBACK} />;

  return (
    <>
      {/* Shimmer shown while state === "loading" */}
      {state === "loading" && <div className={`${SHIMMER} absolute inset-0`} />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        decoding="async"
        className={className}
        onLoad={() => { clearTimer(); setState("loaded"); }}
        onError={() => { clearTimer(); setState("failed"); }}
      />
    </>
  );
};

export default TimedImage;
