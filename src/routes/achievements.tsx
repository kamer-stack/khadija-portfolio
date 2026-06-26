import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Award, Sparkles, GraduationCap, Users, Laptop } from "lucide-react";
import { CERTS, CERT_ICONS, type CertTag } from "@/data/certs";
import { ScrollProgressLine } from "@/components/ScrollProgressLine";


export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Khadija Amer" },
      { name: "description", content: "Milestones, scholarships, leadership roles, and certifications of Khadija Amer." },
      { property: "og:title", content: "Achievements — Khadija Amer" },
      { property: "og:description", content: "Awards, certifications, and leadership milestones." },
    ],
  }),
  component: AchievementsPage,
});

interface Milestone {
  icon: typeof Award;
  title: string;
  period: string;
  badge?: string;
  body: string;
}

const MILESTONES: Milestone[] = [
  {
    icon: Sparkles,
    title: "Campus Ambassador — LoopVerse 2.0 (LoopLab)",
    period: "Jan 2026 — Apr 2026",
    badge: "Best of the Ambassadors",
    body: "Awarded the prestigious 'Best of the Ambassadors' shield out of 100+ peers nationwide for driving registration and managing community engagement.",
  },
  {
    icon: Award,
    title: "Honhaar Scholarship",
    period: "Awarded",
    badge: "Fully Funded — 4 Year Tuition",
    body: "Ultra-competitive Honhaar Scholar award covering 100% of university tuition fees for the full 4-year bachelor's degree under the CM initiative.",
  },
  {
    icon: GraduationCap,
    title: "Teaching Assistant — PUCIT-FCIT",
    period: "Sep 2025 — Jan 2026",
    badge: "Under Dr. Madiha Khalid",
    body: "Selected to assist Dr. Madiha Khalid for the ICT course; structured lab materials and supervised laboratory instruction sessions for 50+ students.",
  },
  {
    icon: Laptop,
    title: "CM Punjab Laptop Award",
    period: "Awarded",
    badge: "Provincial Merit",
    body: "Awarded high-performance technical hardware through a highly competitive, provincial academic merit initiative.",
  },
  {
    icon: Users,
    title: "Campus Ambassador — FCIT Developers Club (FDC)",
    period: "Jul 2025",
    badge: "FDC Summer Boot Camp 2025",
    body: "Appointed as Campus Ambassador managing outreach and student registrations for the FDC Summer Boot Camp 2025.",
  },
];

type Tag = "All" | CertTag;
const TAGS: Tag[] = ["All", "Academic", "Technical", "Sports", "Soft Skills & Leadership"];

function AchievementsPage() {
  const [active, setActive] = useState<Tag>("All");
  const milestonesRef = useRef<HTMLOListElement>(null);
  const filtered = CERTS.filter((c) => active === "All" || c.tags.includes(active));


  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <header className="max-w-3xl">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ achievements</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
          Milestones &amp; Certificates
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A timeline of leadership and a filterable grid of credentials — the proof points
          behind the work.
        </p>
      </header>

      <section className="mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10">Major Milestones</h2>
        <ol ref={milestonesRef} className="relative ml-3 space-y-10">
          <ScrollProgressLine containerRef={milestonesRef} className="left-0" />


          {MILESTONES.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.title} className="ml-8">
                <span className="absolute -left-[18px] grid h-9 w-9 place-items-center rounded-full bg-background border border-primary/50 shadow-[0_0_20px_oklch(0.68_0.24_295/0.4)]">
                  <Icon size={16} className="text-primary" />
                </span>
                <div className="glass glow-border rounded-2xl p-6">
                  <p className="text-xs font-mono text-primary uppercase tracking-widest">{m.period}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-display font-semibold">{m.title}</h3>
                    {m.badge && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-primary/15 text-primary border border-primary/30">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Certificates &amp; Honors</h2>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                  active === t
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_oklch(0.68_0.24_295/0.5)]"
                    : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => {
            const Icon = CERT_ICONS[c.icon] ?? Award;
            return (
              <article key={c.title} className="glass glow-border rounded-2xl p-6 flex flex-col">
                {c.image && (
                  <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-2xl border-b border-border/50 bg-secondary/30 aspect-[4/3]">
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 grid place-items-center rounded-lg bg-primary/10 text-primary border border-primary/30">
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {c.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-secondary/60 text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="mt-4 text-base font-display font-semibold leading-snug">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
