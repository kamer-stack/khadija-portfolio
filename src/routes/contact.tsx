import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Linkedin, Mail, Send, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Khadija Amer" },
      { name: "description", content: "Get in touch with Khadija Amer — email, GitHub, and LinkedIn." },
      { property: "og:title", content: "Contact — Khadija Amer" },
      { property: "og:description", content: "Let's talk about backend, security, or collaboration." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const email = "khadijaaamerrr@gmail.com";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Portfolio inquiry — ${fd.get("name") || "Hello"}`);
    const body = encodeURIComponent(`${fd.get("message")}\n\n— ${fd.get("name")} (${fd.get("email")})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <header className="max-w-3xl">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">/ contact</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Let's build something</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Open to collaboration on backend systems, security research, and CS community initiatives. Drop a note or
          reach out on any channel below.
        </p>
      </header>

      <div className="mt-16 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={onSubmit} className="lg:col-span-3 glass rounded-2xl p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Name</span>
              <input
                name="name"
                required
                className="mt-2 w-full bg-secondary/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full bg-secondary/40 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition"
                placeholder="you@domain.com"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Message</span>
            <textarea
              name="message"
              required
              rows={6}
              className="mt-2 w-full bg-secondary/40 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition resize-none"
              placeholder="Tell me about the project, idea, or question…"
            />
          </label>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Opens in your mail client.</p>
            <button type="submit" className="btn-primary">
              {sent ? <><Check size={16} /> Sent</> : <><Send size={16} /> Send Message</>}
            </button>
          </div>
        </form>

        {/* Channels */}
        <aside className="lg:col-span-2 space-y-4">
          <a
            href={`mailto:${email}`}
            className="glass glow-border rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div className="h-11 w-11 grid place-items-center rounded-lg bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary/20 transition">
              <Mail size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Email</p>
              <p className="font-display font-semibold truncate">{email}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); copyEmail(); }}
              className="text-xs font-mono px-2 py-1 rounded bg-secondary/60 hover:bg-primary/20 hover:text-primary transition"
              aria-label="Copy email"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </a>

          <a
            href="https://github.com/kamer-stack"
            target="_blank"
            rel="noreferrer"
            className="glass glow-border rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div className="h-11 w-11 grid place-items-center rounded-lg bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary/20 transition">
              <Github size={18} />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">GitHub</p>
              <p className="font-display font-semibold">github.com/kamer-stack</p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/khadija-amer-7821a8334"
            target="_blank"
            rel="noreferrer"
            className="glass glow-border rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div className="h-11 w-11 grid place-items-center rounded-lg bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary/20 transition">
              <Linkedin size={18} />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">LinkedIn</p>
              <p className="font-display font-semibold">/in/khadija-amer</p>
            </div>
          </a>
        </aside>
      </div>
    </div>
  );
}
