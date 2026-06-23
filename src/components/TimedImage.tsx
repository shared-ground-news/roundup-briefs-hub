import { useState, useEffect, useRef } from "react";

const GRADIENT_CLASS =
  "w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)]";

interface TimedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  timeout?: number;
}

const TimedImage = ({ src, alt, className, timeout = 5000 }: TimedImageProps) => {
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setTimedOut(false);
    if (!src) return;
    timerRef.current = setTimeout(() => {
      if (imgRef.current && !imgRef.current.complete) {
        setTimedOut(true);
      }
    }, timeout);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [src, timeout]);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (!src || timedOut) {
    return <div className={GRADIENT_CLASS} />;
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onLoad={clearTimer}
      onError={() => { clearTimer(); setTimedOut(true); }}
    />
  );
};

export default TimedImage;
