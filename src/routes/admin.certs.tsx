import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Upload, Download, Copy, Trash2, Check } from "lucide-react";
import { CERTS, type Cert, type CertTag } from "@/data/certs";

export const Route = createFileRoute("/admin/certs")({
  head: () => ({
    meta: [
      { title: "Certificate Manager" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminCertsPage,
});

const TAGS: CertTag[] = ["Technical", "Academic", "Sports"];
const ICONS: Cert["icon"][] = [
  "Award",
  "ShieldCheck",
  "Code2",
  "Trophy",
  "FileSpreadsheet",
  "GraduationCap",
  "Medal",
  "Flag",
];

interface Draft {
  id: string;
  file: File;
  previewUrl: string;
  filename: string;
  title: string;
  tags: CertTag[];
  body: string;
  icon: Cert["icon"];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function AdminCertsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setDrafts((prev) => [
      ...prev,
      ...list.map((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "png";
        const slug = slugify(file.name) || `cert-${Date.now()}`;
        return {
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          filename: `${slug}.${ext}`,
          title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          tags: ["Technical"] as CertTag[],
          body: "",
          icon: "Award" as Cert["icon"],
        };
      }),
    ]);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  const remove = (id: string) =>
    setDrafts((prev) => {
      const d = prev.find((x) => x.id === id);
      if (d) URL.revokeObjectURL(d.previewUrl);
      return prev.filter((x) => x.id !== id);
    });

  const downloadAll = () => {
    drafts.forEach((d) => {
      const a = document.createElement("a");
      a.href = d.previewUrl;
      a.download = d.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  };

  const snippet = useMemo(() => {
    if (!drafts.length) return "";
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return drafts
      .map(
        (d) => `  {
    title: "${esc(d.title)}",
    tags: [${d.tags.map((t) => `"${t}"`).join(", ")}],
    body: "${esc(d.body)}",
    icon: "${d.icon}",
    image: "/certs/${d.filename}",
  },`,
      )
      .join("\n");
  }, [drafts]);

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
      <header className="max-w-3xl">
        <p className="text-xs font-mono text-primary uppercase tracking-[0.3em]">
          / admin / certs
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gradient">
          Certificate Manager
        </h1>
        <p className="mt-4 text-muted-foreground">
          Drag images in, fill the details, then download the renamed files into{" "}
          <code className="px-1.5 py-0.5 rounded bg-secondary/60 text-primary text-sm">
            /public/certs/
          </code>{" "}
          and paste the snippet into{" "}
          <code className="px-1.5 py-0.5 rounded bg-secondary/60 text-primary text-sm">
            src/data/certs.ts
          </code>
          . Fully portable — works outside Lovable too.
        </p>
      </header>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all ${
          dragOver
            ? "border-primary bg-primary/10"
            : "border-border bg-secondary/20 hover:border-primary/50"
        }`}
      >
        <Upload className="text-primary" size={32} />
        <p className="text-sm font-medium">Drop certificate images here</p>
        <p className="text-xs text-muted-foreground">or click to browse — PNG, JPG, WebP</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {drafts.length > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {drafts.map((d) => (
              <div key={d.id} className="glass glow-border rounded-xl p-4 flex gap-4">
                <img
                  src={d.previewUrl}
                  alt=""
                  className="h-28 w-28 object-cover rounded-lg border border-border shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    value={d.title}
                    onChange={(e) => update(d.id, { title: e.target.value })}
                    placeholder="Title"
                    className="w-full bg-secondary/40 border border-border rounded px-2 py-1 text-sm"
                  />
                  <input
                    value={d.filename}
                    onChange={(e) => update(d.id, { filename: e.target.value })}
                    placeholder="filename.png"
                    className="w-full bg-secondary/40 border border-border rounded px-2 py-1 text-xs font-mono"
                  />
                  <div className="flex gap-2">
                    <select
                      value={d.tags[0] ?? "Technical"}
                      onChange={(e) => update(d.id, { tags: [e.target.value as CertTag] })}
                      className="flex-1 bg-secondary/40 border border-border rounded px-2 py-1 text-xs"
                    >
                      {TAGS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <select
                      value={d.icon}
                      onChange={(e) =>
                        update(d.id, { icon: e.target.value as Cert["icon"] })
                      }
                      className="flex-1 bg-secondary/40 border border-border rounded px-2 py-1 text-xs"
                    >
                      {ICONS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={d.body}
                    onChange={(e) => update(d.id, { body: e.target.value })}
                    placeholder="Short description…"
                    rows={2}
                    className="w-full bg-secondary/40 border border-border rounded px-2 py-1 text-xs resize-none"
                  />
                  <button
                    onClick={() => remove(d.id)}
                    className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={downloadAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              <Download size={16} /> Download {drafts.length} renamed file(s)
            </button>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 text-primary text-sm font-medium hover:bg-primary/10"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
              {copied ? "Copied!" : "Copy snippet"}
            </button>
          </div>

          <pre className="mt-6 p-4 rounded-xl bg-secondary/40 border border-border text-xs font-mono overflow-x-auto whitespace-pre">
            {snippet}
          </pre>

          <p className="mt-4 text-xs text-muted-foreground">
            Paste these objects into the <code>CERTS</code> array in{" "}
            <code>src/data/certs.ts</code>, and put the downloaded files in{" "}
            <code>public/certs/</code>.
          </p>
        </>
      )}

      <div className="mt-16 glass rounded-xl p-5">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Currently configured
        </p>
        <p className="mt-1 text-sm">
          {CERTS.length} certificates — {CERTS.filter((c) => c.image).length} with images.
        </p>
      </div>
    </div>
  );
}