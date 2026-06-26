import { createFileRoute } from "@tanstack/react-router";
import { Github, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Khadija Amer" },
      { name: "description", content: "Security and systems projects: packet sniffing dashboard, exploitation framework, log analyzer, KadEdit editor, and more." },
      { property: "og:title", content: "Projects — Khadija Amer" },
      { property: "og:description", content: "Case studies in blue-team security, systems engineering, and C++ tooling." },
    ],
  }),
  component: ProjectsPage,
});

interface Project {
  title: string;
  stack: string[];
  description: string;
  repo?: string;
  demo?: string;
  feature?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: "Network Traffic Monitor",
    stack: ["Python", "Flask", "Scapy"],
    description:
      "Browser-based packet sniffing dashboard capturing real-time packet data, tracking protocol analysis, and implementing live port-to-service mapping for 20+ common ports. Includes a smart fallback simulation mode when tracking permissions are insufficient.",
    repo: "https://github.com/kamer-stack/network-traffic-monitor",
    feature: true,
  },
  {
    title: "Buffer Overflow Exploitation",
    stack: ["Python", "pwntools", "x64dbg"],
    description:
      "Automated framework computing EIP offsets via cyclic patterns, performing shellcode injection, and documenting ASLR, DEP, and stack canary bypasses for security research.",
  },
  {
    title: "Log Analyzer",
    stack: ["Python", "CLI", "Web Dashboard"],
    description:
      "Advanced server log parsing tool engineered to process 38 operational system edge cases gracefully. Tracks status codes, request counts, traffic by hour, anomaly flags, and malformed lines.",
    repo: "https://github.com/kamer-stack/log-analyzer",
    demo: "https://kamer-stack.github.io/log-analyzer/web_ui.html",
  },
  {
    title: "KadEdit Text Editor",
    stack: ["C++", "HTML"],
    description:
      "Feature-rich code and text editor with a VS Code-inspired dark browser GUI. Implements dynamic text line storage via vector strings, recent file queues, and stack-based undo/redo history trackers.",
    repo: "https://github.com/kamer-stack/KadEdit",
    demo: "https://kamer-stack.github.io/KadEdit/",
  },
  {
    title: "Infix Engine",
    stack: ["C++"],
    description:
      "High-performance expression parsing, verification, evaluation, and structural algorithm optimization component for computer science coursework.",
    repo: "https://github.com/kamer-stack/infix-engine",
    demo: "https://kamer-stack.github.io/infix-engine/",
  },
  {
    title: "Chrome Dino Game",
    stack: ["C++"],
    description:
      "Desktop recreation of the iconic browser endless runner. Optimizes geometric bounding shapes and asset collision engine loops for smooth gameplay.",
    repo: "https://github.com/kamer-stack/CHROME-DINO-GAME",
  },
  {
    title: "Mine Sweeper Game",
    stack: ["C++"],
    description:
      "Grid-based console game built with structural arrays and file handling. Features dynamic difficulty scaling, a custom flagging system, high-score tracking files, and an automated recursive reveal algorithm. Developed with Ayesha Arif.",
    repo: "https://github.com/kamer-stack/Minesweeper-game-",
  },
];

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <header className="max-w-3xl">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ projects</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
          Projects Matrix
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Seven distinct builds across blue-team tooling, exploit research, and systems
          engineering — each shipped with source and, where applicable, a live demo.
        </p>
      </header>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <article
            key={p.title}
            className={`glass glow-border rounded-2xl p-7 flex flex-col ${p.feature ? "md:col-span-2" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-display font-bold">{p.title}</h2>
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm text-muted-foreground leading-relaxed flex-1">
              {p.description}
            </p>

            {(p.repo || p.demo) && (
              <div className="mt-6 pt-5 border-t border-border/40 flex flex-wrap items-center gap-3">
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-secondary/60 border border-border hover:border-primary/60 hover:text-primary transition"
                  >
                    <Github size={15} /> View Code
                  </a>
                )}
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg btn-primary"
                  >
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
