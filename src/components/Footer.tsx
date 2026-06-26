import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-32">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2026 Khadija Amer. Handcrafted with passion and code.</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/kamer-stack" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub"><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/khadija-amer-7821a8334" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="mailto:khadijaaamerrr@gmail.com" className="hover:text-primary transition-colors" aria-label="Email"><Mail size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
