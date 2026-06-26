import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight, Linkedin, Github, ChevronDown, Shield, Activity, Terminal } from "lucide-react";
import { NetworkScene, useScrollProgress } from "../components/NetworkScene";
import { StarsBackground } from "../components/StarsBackground";


const LINKEDIN_URL = "https://www.linkedin.com/in/khadija-amer-7821a8334";
const GITHUB_URL = "https://github.com/kamer-stack";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Khadija Amer — Cyber Security Portfolio" },
      { name: "description", content: "Blue-team focused cyber security portfolio: incident response, log triage, network monitoring, and threat modeling." },
      { property: "og:title", content: "Khadija Amer — Cyber Security Portfolio" },
      { property: "og:description", content: "Hands-on packet analysis, log triage, and vulnerability assessment." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sceneRef);

  return (
    <>
      <section ref={sceneRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 bg-background">
            <NetworkScene scrollProgress={progress} />
          </div>

          {/* Layered typography — hollow outline, single line */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none px-4"
            style={{ opacity: 1 - progress * 1.4 }}
          >
            <div className="relative w-full flex items-center justify-center">
              <h1
                aria-label="Khadija Amer"
                className="select-none font-black uppercase text-center whitespace-nowrap"
                style={{
                  fontFamily: "'Space Grotesk', Inter, sans-serif",
                  fontSize: "clamp(2.25rem, 13vw, 11rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: "rgba(220, 210, 255, 0.18)",
                  WebkitTextStroke: "1px rgba(220, 210, 255, 0.35)",
                  textShadow: "0 0 60px oklch(0.68 0.24 295 / 0.18)",
                }}
              >
                KHADIJA&nbsp;AMER
              </h1>
            </div>
          </div>

          {/* Foreground content block (tag + subtitle + CTAs) */}
          <div
            className="absolute inset-x-0 top-[8%] flex justify-center px-6 pointer-events-none"
            style={{ opacity: 1 - progress * 1.4 }}
          >
            <div className="text-center pointer-events-auto animate-fade-up">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-primary border border-primary/30 bg-primary/5 backdrop-blur-sm">
                BLUE TEAM · BSCS · PUCIT · CLASS OF 2028
              </span>
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-5 px-6 pointer-events-none"
            style={{ opacity: 1 - progress * 1.4 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <Link to="/projects" className="btn-primary">
                Explore My Work <ArrowRight size={16} />
              </Link>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                <Github size={16} /> GitHub
              </a>
            </div>
            <div className="mt-2 flex flex-col items-center gap-1 text-xs text-muted-foreground/70 animate-float">
              <span>scroll</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 overflow-hidden">
        <StarsBackground className="absolute inset-0 w-full h-full pointer-events-none -z-10" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { k: "Focus", v: "Blue Team & SOC", Icon: Shield },
              { k: "Discipline", v: "Logs · Packets · Triage", Icon: Activity },
              { k: "Toolkit", v: "Wireshark · Burp · Scapy", Icon: Terminal },
            ].map(({ k, v, Icon }) => (
              <div key={k} className="glass glow-border rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 grid place-items-center rounded-lg bg-primary/10 text-primary border border-primary/30">
                    <Icon size={16} />
                  </div>
                  <p className="text-xs font-mono text-primary uppercase tracking-widest">{k}</p>
                </div>
                <p className="mt-3 text-xl font-display font-semibold">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/about" className="btn-ghost">
              Read my story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
