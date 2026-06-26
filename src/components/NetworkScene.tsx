import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  scrollProgress: number;
  asBackground?: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
}

export function NetworkScene({ scrollProgress, asBackground = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let nodes: Node[] = [];

    const buildNodes = () => {
      const density = asBackground ? 18000 : 11000;
      const count = Math.min(160, Math.max(40, Math.floor((width * height) / density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const linkBase = asBackground ? 120 : 150;

    const tick = () => {
      const p = progressRef.current;
      const scale = asBackground ? 1 : 1 - Math.min(0.6, p * 0.75);
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Grid matrix scanlines fade in as we scroll (foreground only)
      if (!asBackground && p > 0.25) {
        const a = Math.min(0.22, (p - 0.25) * 0.4);
        ctx.strokeStyle = `rgba(139, 92, 246, ${a})`;
        ctx.lineWidth = 1;
        const step = 60;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
      }

      const mouse = mouseRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const d = Math.sqrt(d2) || 1;
            const f = (140 - d) / 140;
            n.x += (dx / d) * f * 4;
            n.y += (dy / d) * f * 4;
          }
        }
        n.pulse += 0.04;
      }

      const sx = (x: number) => cx + (x - cx) * scale;
      const sy = (y: number) => cy + (y - cy) * scale;
      const linkDist = linkBase * (asBackground ? 1 : 0.7 + scale * 0.5);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * (asBackground ? 0.16 : 0.38);
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(sx(a.x), sy(a.y));
            ctx.lineTo(sx(b.x), sy(b.y));
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const glow = 0.6 + Math.sin(n.pulse) * 0.3;
        const r = n.r * (asBackground ? 0.8 : 1);
        const x = sx(n.x), y = sy(n.y);
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        grd.addColorStop(0, `rgba(196, 181, 253, ${0.9 * glow})`);
        grd.addColorStop(0.4, `rgba(139, 92, 246, ${0.25 * glow})`);
        grd.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(237, 233, 254, ${0.85 + glow * 0.15})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [asBackground]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(total, Math.max(0, -rect.top));
    setProgress(total > 0 ? scrolled / total : 0);
  }, [ref]);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);
  return progress;
}
