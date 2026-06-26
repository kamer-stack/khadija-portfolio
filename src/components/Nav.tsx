import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/achievements", label: "Achievements" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-auto max-w-6xl px-6 transition-all ${scrolled ? "" : ""}`}>
        <nav className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all ${scrolled ? "glass" : ""}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm shadow-[var(--shadow-glow)]">
              KA
            </span>
            <span className="font-display font-semibold tracking-tight hidden sm:inline">Khadija Amer</span>
          </Link>
          <ul className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "text-foreground bg-secondary/60" }}
                  inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
