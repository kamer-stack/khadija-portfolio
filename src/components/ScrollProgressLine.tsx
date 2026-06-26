import { useEffect, useRef, useState, type RefObject } from "react";

interface Props {
  /** Ref to the relative-positioned container whose height bounds the line. */
  containerRef: RefObject<HTMLElement | null>;
  /** Positioning classes for the line (e.g. "left-4 md:left-1/2 md:-translate-x-1/2"). */
  className?: string;
}

/**
 * Scroll-linked vertical progress line. A faint base track plus a vibrant
 * neon-purple fill that follows the viewport center down the container.
 * Single rAF-throttled scroll listener; mutates only one inline style.
 */
export function ScrollProgressLine({ containerRef, className = "" }: Props) {
  const fillRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = containerRef.current;
      const fill = fillRef.current;
      if (!el || !fill) return;
      const rect = el.getBoundingClientRect();
      const anchor = window.innerHeight * 0.5;
      const progress = Math.max(0, Math.min(rect.height, anchor - rect.top));
      fill.style.height = `${progress}px`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    setReady(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <>
      <div
        className={`pointer-events-none absolute top-0 bottom-0 w-px bg-primary/15 ${className}`}
        aria-hidden
      />
      <div
        ref={fillRef}
        className={`pointer-events-none absolute top-0 w-px bg-gradient-to-b from-primary/30 via-primary to-primary shadow-[0_0_14px_2px_oklch(0.68_0.24_295/0.75)] ${className}`}
        style={{ height: 0, opacity: ready ? 1 : 0, transition: "opacity 400ms ease, height 120ms linear" }}
        aria-hidden
      />
    </>
  );
}
