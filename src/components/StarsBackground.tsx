import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkle: number;
  twinkleSpeed: number;
  brightness: number;
}

export function StarsBackground({ className = "fixed inset-0 w-full h-full pointer-events-none -z-10" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let stars: Star[] = [];
    const mouse = { x: -1000, y: -1000, active: false };
    let raf = 0;
    let t = 0;
    const ro = new ResizeObserver(() => resize());

    const initStars = () => {
      const density = Math.min(260, Math.floor((width * height) / 6500));
      stars = [];
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.1,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          brightness: 0,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };
    const onWindowLeave = () => {
      mouse.active = false;
    };

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Faint cosmic clouds (drifting radial gradients)
      const clouds = [
        { x: width * 0.25 + Math.sin(t * 0.3) * 40, y: height * 0.3 + Math.cos(t * 0.2) * 30, r: Math.max(width, height) * 0.45, c: "139, 92, 246" },
        { x: width * 0.75 + Math.cos(t * 0.25) * 50, y: height * 0.7 + Math.sin(t * 0.35) * 40, r: Math.max(width, height) * 0.5, c: "168, 85, 247" },
        { x: width * 0.5 + Math.sin(t * 0.15) * 60, y: height * 0.5 + Math.cos(t * 0.18) * 50, r: Math.max(width, height) * 0.4, c: "99, 102, 241" },
      ];
      for (const c of clouds) {
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        g.addColorStop(0, `rgba(${c.c}, 0.06)`);
        g.addColorStop(0.5, `rgba(${c.c}, 0.02)`);
        g.addColorStop(1, `rgba(${c.c}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Stars
      const hoverR = 140;
      const hoverR2 = hoverR * hoverR;
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;

        let mouseBoost = 0;
        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < hoverR2) {
            mouseBoost = (1 - d2 / hoverR2) * 1.0;
          }
        }
        // Smooth brightness decay
        s.brightness += (mouseBoost - s.brightness) * 0.15;

        const twinkleAlpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        const alpha = Math.min(1, twinkleAlpha + s.brightness * 0.9);
        const radius = s.r + s.brightness * 1.8;

        // Glow halo when bright
        if (s.brightness > 0.05) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 6);
          glow.addColorStop(0, `rgba(196, 181, 253, ${s.brightness * 0.5})`);
          glow.addColorStop(0.5, `rgba(139, 92, 246, ${s.brightness * 0.15})`);
          glow.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle cross when very bright
        if (s.brightness > 0.3) {
          ctx.strokeStyle = `rgba(224, 213, 255, ${s.brightness * 0.7})`;
          ctx.lineWidth = 0.6;
          const len = radius * 5;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    ro.observe(canvas);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onWindowLeave);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onWindowLeave);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
    />
  );
}
