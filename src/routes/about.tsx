import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { PhysicsSkills } from "../components/PhysicsSkills";
import { ScrollProgressLine } from "../components/ScrollProgressLine";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Khadija Amer" },
      { name: "description", content: "Cyber security student at PUCIT focused on SOC analysis, packet inspection, log triage, and vulnerability assessment." },
      { property: "og:title", content: "About — Khadija Amer" },
      { property: "og:description", content: "BSCS @ PUCIT. Blue team, SOC analysis, packet inspection." },
    ],
  }),
  component: AboutPage,
});

interface EduItem {
  side: "left" | "right";
  school: string;
  degree: string;
  period: string;
  body: string;
  badge?: string;
}

const EDUCATION: EduItem[] = [
  {
    side: "right",
    school: "University of the Punjab — PUCIT",
    degree: "BSCS",
    period: "2024 — 2028",
    body: "Core focus: Information Security, Network Security, Computer Networks, OOP, DSA, PL/SQL. Active member of EMS (Event Management Society) and the Sports Society.",
    badge: "Honhaar Scholar — Fully Funded Academic Merit Scholarship",
  },
  {
    side: "left",
    school: "Punjab Group of Colleges",
    degree: "FSc · Grade A+",
    period: "2 Years",
    body: "Sustained merit-level performance throughout, consistently ranking among the top of the cohort.",
    badge: "Awarded Merit Scholarship",
  },
  {
    side: "right",
    school: "Connoisseur Grammar School",
    degree: "Matriculation (SSC)",
    period: "Completed",
    body: "Ranked 2nd across the entire school cohort. Awarded the Board Merit Shield for academic excellence.",
  },
];

function AboutPage() {
  const eduRef = useRef<HTMLDivElement>(null);
  return (

    <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <header className="max-w-3xl animate-fade-up">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ about</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
          Blue Team in Training
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          I'm Khadija — a Computer Science student at <span className="text-foreground">PUCIT, University of the Punjab</span>
          {" "}(Class of 2028), training to become a <span className="text-foreground">SOC Analyst</span>. My work centers on the
          defensive side of security: <span className="text-foreground">incident response</span>, <span className="text-foreground">log triage</span>,
          {" "}<span className="text-foreground">network monitoring</span>, <span className="text-foreground">packet sniffing</span>,
          {" "}<span className="text-foreground">threat modeling</span>, and <span className="text-foreground">vulnerability assessment</span>.
        </p>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          I build the tools I want to use — a live packet sniffing dashboard, a log analyzer that handles 38+ malformed
          edge cases, and an automated buffer overflow framework that documents bypasses for ASLR, DEP, and stack
          canaries. Outside the terminal I'm a teaching assistant under Dr. Madiha Khalid, a national campus ambassador,
          and a cricket coordinator at PUCIT Sports Society.
        </p>
      </header>

      <section className="mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ tech-stack</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Interactive Toolkit</h2>
            <p className="text-sm text-muted-foreground mt-2">Drag, fling, collide. Real physics — same as the tools.</p>
          </div>
        </div>
        <PhysicsSkills />
      </section>

      {/* Education — alternating vertical timeline */}
      <section className="mt-24">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ education</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Academic Journey</h2>

        <div ref={eduRef} className="relative mt-12">
          {/* Scroll-linked center anchor */}
          <ScrollProgressLine
            containerRef={eduRef}
            className="left-4 md:left-1/2 md:-translate-x-1/2"
          />


          <ol className="space-y-12">
            {EDUCATION.map((e, i) => (
              <li
                key={e.school}
                className={`relative grid md:grid-cols-2 gap-6 md:gap-12 ${
                  e.side === "left" ? "md:[&>*:first-child]:order-1" : ""
                }`}
              >
                {/* Card */}
                <div
                  className={`pl-12 md:pl-0 ${
                    e.side === "right" ? "md:col-start-2" : "md:col-start-1 md:text-right"
                  }`}
                >
                  <div className="glass glow-border rounded-2xl p-6">
                    <p className="text-xs font-mono text-primary uppercase tracking-widest">{e.period}</p>
                    <h3 className="mt-2 text-lg font-display font-semibold">{e.school}</h3>
                    <p className="mt-1 text-sm text-foreground/90">{e.degree}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{e.body}</p>
                    {e.badge && (
                      <div className={`mt-4 flex ${e.side === "left" ? "md:justify-end" : "justify-start"}`}>
                        <span className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-md bg-primary/15 text-primary border border-primary/40 shadow-[0_0_18px_oklch(0.68_0.24_295/0.35)]">
                          ★ {e.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Node */}
                <span
                  className="absolute left-4 md:left-1/2 top-6 md:-translate-x-1/2 grid h-7 w-7 place-items-center rounded-full bg-background border border-primary/60 shadow-[0_0_18px_oklch(0.68_0.24_295/0.6)]"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>

                {/* Spacer */}
                <div className="hidden md:block" aria-hidden style={{ gridColumn: e.side === "right" ? 1 : 2 }}>
                  <span className="sr-only">{i}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-24">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ activity</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Coding Activity Tracker</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Live GitHub contribution graph for{" "}
          <a href="https://github.com/kamer-stack" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            @kamer-stack
          </a>
          .
        </p>
        <div className="mt-6 glass glow-border rounded-2xl p-6 overflow-x-auto">
          <a href="https://github.com/kamer-stack" target="_blank" rel="noreferrer" className="block min-w-[700px]">
            <img
              src="https://ghchart.rshah.org/8b5cf6/kamer-stack"
              alt="GitHub contribution graph for kamer-stack"
              className="w-full"
              loading="lazy"
            />
          </a>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <img
              src="https://github-readme-stats.vercel.app/api?username=kamer-stack&show_icons=true&theme=midnight-purple&hide_border=true&bg_color=00000000&title_color=a78bfa&icon_color=8b5cf6&text_color=e5e7eb"
              alt="GitHub stats"
              className="w-full rounded-lg"
              loading="lazy"
            />
            <img
              src="https://github-readme-streak-stats.herokuapp.com/?user=kamer-stack&theme=midnight-purple&hide_border=true&background=00000000&stroke=8b5cf6&ring=a78bfa&fire=c084fc&currStreakLabel=a78bfa"
              alt="GitHub streak"
              className="w-full rounded-lg"
              loading="lazy"
            />
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=kamer-stack&layout=compact&theme=midnight-purple&hide_border=true&bg_color=00000000&title_color=a78bfa&text_color=e5e7eb"
              alt="Top languages"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <div className="mt-16 text-center">
        <Link to="/projects" className="btn-primary">See the projects <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
