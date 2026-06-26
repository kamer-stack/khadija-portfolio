import { useEffect, useRef } from "react";

const SKILLS = [
  "C/C++", "Python", "Flask", "Scapy", "pwntools", "PL/SQL",
  "HTML", "CSS", "JavaScript", "PHP", "Wireshark", "Nmap",
  "Docker", "Kali Linux", "Bash", "Burp Suite", "Metasploit",
  "x64dbg", "PE-Bear", "Gobuster", "Ubuntu", "Windows", "XAMPP",
];

interface Ball {
  label: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  sprite?: HTMLCanvasElement;
}

export function PhysicsSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;

    // Measure font once and cache label widths for radius sizing
    const measureRadius = (label: string) => {
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      const w = ctx.measureText(label).width;
      return Math.max(30, Math.min(54, w / 2 + 16));
    };

    const balls: Ball[] = SKILLS.map((label, i) => ({
      label,
      r: 38,
      x: 0,
      y: -60 - i * 30,
      vx: (Math.random() - 0.5) * 2,
      vy: 0,
    }));

    // Pre-render each ball to an offscreen canvas — heavy ops (gradient,
    // shadowBlur, stroke, text) run ONCE per ball instead of every frame.
    const buildSprite = (b: Ball) => {
      const pad = Math.ceil(b.r * 0.6);
      const size = Math.ceil((b.r * 2 + pad * 2));
      const off = document.createElement("canvas");
      off.width = Math.floor(size * dpr);
      off.height = Math.floor(size * dpr);
      const o = off.getContext("2d")!;
      o.scale(dpr, dpr);
      const cx = size / 2;
      const cy = size / 2;

      // glow
      const grad = o.createRadialGradient(cx, cy, b.r * 0.2, cx, cy, b.r * 1.5);
      grad.addColorStop(0, "rgba(139, 92, 246, 0.35)");
      grad.addColorStop(0.6, "rgba(139, 92, 246, 0.12)");
      grad.addColorStop(1, "rgba(139, 92, 246, 0)");
      o.fillStyle = grad;
      o.beginPath();
      o.arc(cx, cy, b.r * 1.5, 0, Math.PI * 2);
      o.fill();

      // body
      o.fillStyle = "rgba(20, 18, 32, 0.88)";
      o.beginPath();
      o.arc(cx, cy, b.r, 0, Math.PI * 2);
      o.fill();

      // neon border with shadow
      o.strokeStyle = "rgba(167, 139, 250, 0.95)";
      o.lineWidth = 1.5;
      o.shadowColor = "rgba(139, 92, 246, 0.9)";
      o.shadowBlur = 10;
      o.stroke();
      o.shadowBlur = 0;

      // label
      o.fillStyle = "#ffffff";
      o.font = "600 13px Inter, system-ui, sans-serif";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(b.label, cx, cy);

      b.sprite = off;
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      width = w;
      height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      balls.forEach((b) => {
        b.r = measureRadius(b.label);
        buildSprite(b);
      });
    };

    resize();
    // Spawn x positions across width once we know it
    balls.forEach((b, i) => {
      b.x = b.r + 10 + Math.random() * Math.max(1, width - 2 * b.r - 20);
      b.y = -60 - i * 40;
    });

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Physics constants
    const GRAVITY = 0.45;
    const FRICTION = 0.992;
    const WALL_DAMP = 0.72;
    const RESTITUTION = 0.85;

    // Pointer interaction (mouse + touch + pen) with velocity tracking for fling
    let dragging: Ball | null = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseVX = 0;
    let mouseVY = 0;
    let lastMoveTime = performance.now();

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      // Prevent the browser from interpreting touch as scroll/pan
      if (e.pointerType !== "mouse") e.preventDefault();
      const { x, y } = getPos(e);
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dx = x - b.x;
        const dy = y - b.y;
        if (dx * dx + dy * dy <= b.r * b.r) {
          dragging = b;
          dragOffsetX = dx;
          dragOffsetY = dy;
          lastMouseX = x;
          lastMouseY = y;
          mouseVX = 0;
          mouseVY = 0;
          lastMoveTime = performance.now();
          try { canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }
          break;
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      if (e.pointerType !== "mouse") e.preventDefault();
      const { x, y } = getPos(e);
      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTime);
      mouseVX = ((x - lastMouseX) / dt) * 16;
      mouseVY = ((y - lastMouseY) / dt) * 16;
      lastMouseX = x;
      lastMouseY = y;
      lastMoveTime = now;
      dragging.x = x - dragOffsetX;
      dragging.y = y - dragOffsetY;
      dragging.vx = 0;
      dragging.vy = 0;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      // If the pointer has been still for a moment, don't apply stale velocity
      const idle = performance.now() - lastMoveTime;
      const vx = idle > 80 ? 0 : mouseVX;
      const vy = idle > 80 ? 0 : mouseVY;
      dragging.vx = Math.max(-40, Math.min(40, vx));
      dragging.vy = Math.max(-40, Math.min(40, vy));
      dragging = null;
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);
    // Belt-and-suspenders: stop touch from scrolling the page
    const onTouch = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    canvas.addEventListener("touchmove", onTouch, { passive: false });

    let raf = 0;
    let lastFrame = performance.now();
    const step = () => {
      const now = performance.now();
      // Cap dt so a backgrounded tab doesn't explode the sim on resume
      const dt = Math.min(2, (now - lastFrame) / 16.6667);
      lastFrame = now;

      // Integrate
      for (const b of balls) {
        if (b === dragging) continue;
        b.vy += GRAVITY * dt;
        b.vx *= Math.pow(FRICTION, dt);
        b.vy *= Math.pow(FRICTION, dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * WALL_DAMP; }
        else if (b.x + b.r > width) { b.x = width - b.r; b.vx = -b.vx * WALL_DAMP; }
        if (b.y + b.r > height) { b.y = height - b.r; b.vy = -b.vy * WALL_DAMP; b.vx *= 0.96; }
        else if (b.y - b.r < 0 && b.vy < 0) { b.y = b.r; b.vy = -b.vy * WALL_DAMP; }
      }

      // Ball-ball collisions — 2 iterations to resolve stacking cleanly.
      // Equal-mass impulse formula along the contact normal, with mass-weighted
      // positional correction when one body is pinned (being dragged).
      const n = balls.length;
      for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < n; i++) {
          const a = balls[i];
          for (let j = i + 1; j < n; j++) {
            const c = balls[j];
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const minD = a.r + c.r;
            const d2 = dx * dx + dy * dy;
            if (d2 >= minD * minD || d2 === 0) continue;
            const dist = Math.sqrt(d2);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minD - dist;
            const aPinned = a === dragging;
            const cPinned = c === dragging;
            if (aPinned && cPinned) continue;
            if (aPinned) {
              c.x += nx * overlap;
              c.y += ny * overlap;
            } else if (cPinned) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            } else {
              const half = overlap * 0.5;
              a.x -= nx * half; a.y -= ny * half;
              c.x += nx * half; c.y += ny * half;
            }

            if (iter === 0) {
              // Equal-mass elastic exchange along the normal, scaled by restitution
              const dvx = c.vx - a.vx;
              const dvy = c.vy - a.vy;
              const vn = dvx * nx + dvy * ny;
              if (vn < 0) {
                const j = -(1 + RESTITUTION) * vn * 0.5;
                const ix = j * nx;
                const iy = j * ny;
                if (!aPinned) { a.vx -= ix; a.vy -= iy; }
                if (!cPinned) { c.vx += ix; c.vy += iy; }
              }
            }
          }
        }
      }

      // Draw
      ctx.clearRect(0, 0, width, height);
      for (const b of balls) {
        if (!b.sprite) continue;
        const w = b.sprite.width / dpr;
        const h = b.sprite.height / dpr;
        ctx.drawImage(b.sprite, b.x - w / 2, b.y - h / 2, w, h);
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onUp);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] rounded-2xl glass overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      />
      <div className="absolute top-4 left-4 text-xs text-muted-foreground pointer-events-none font-mono">
        drag · fling · collide
      </div>
    </div>
  );
}
