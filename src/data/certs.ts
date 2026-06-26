// Single source of truth for certificates.
// To add a new certificate:
//   1. Drop the image into /public/certs/ (e.g. /public/certs/my-cert.png)
//   2. Add an entry below with `image: "/certs/my-cert.png"`
// Or use the helper UI at /admin/certs to generate the snippet for you.

export type CertTag =
  | "Technical"
  | "Academic"
  | "Sports"
  | "Soft Skills & Leadership";

export interface Cert {
  title: string;
  tags: CertTag[];
  body: string;
  /** Lucide icon name. See https://lucide.dev — falls back to Award if unknown. */
  icon:
    | "Award"
    | "ShieldCheck"
    | "Code2"
    | "Trophy"
    | "FileSpreadsheet"
    | "GraduationCap"
    | "Medal"
    | "Flag";
  /** Public path to the certificate image, e.g. "/certs/foo.png". Optional. */
  image?: string;
}

export const CERTS: Cert[] = [
  {
    title: "Honhaar Scholarship — University of the Punjab",
    tags: ["Academic"],
    body: "Awarded a highly competitive, 100% merit-based tuition scholarship by the Punjab Higher Education Commission (PHEC). Selected based on stringent academic aggregate cutoffs (≥ 70% in STEM/Sciences) among applicants across the province, recognizing continued academic excellence.",
    icon: "GraduationCap",
    image: "/certs/honhaar-scholarship.jpeg",
  },
  {
    title: "Prompt Airlines AI Security Certificate",
    tags: ["Technical"],
    body: "Issued by Wiz (part of Google Cloud) in May 2026, validating foundational AI system security principles.",
    icon: "ShieldCheck",
    image: "/certs/prompt-airlines-ai-security.png",
  },
  {
    title: "Board Merit Award & Shield",
    tags: ["Academic"],
    body: "Awarded by Connoisseur Grammar School for achieving 2nd Position in Matriculation.",
    icon: "GraduationCap",
    image: "/certs/board-merit-shield.png",
  },
  {
    title: "LoopLab — Best Ambassador Shield",
    tags: ["Academic", "Soft Skills & Leadership"],
    body: "Awarded the 'Best Ambassador' shield at LoopVerse 2.0 by LoopLab for leading with passion and representing the program with pride.",
    icon: "Award",
    image: "/certs/looplab-best-ambassador-shield.png",
  },
  {
    title: "Consistent Academic Excellence — Siqarah Girls High School",
    tags: ["Academic"],
    body: "Recognized throughout school years with multiple Merit Certificates from Siqarah Girls High School, Lahore for sustained top academic performance across grades.",
    icon: "GraduationCap",
    image: "/certs/academic-excellence-merits.jpeg",
  },
  {
    title: "Vista Equity Partners — AI in Action Job Simulation",
    tags: ["Technical"],
    body: "Completed the Vista Equity Partners AI in Action Job Simulation on Forage (Jun 2026). Built fluency in prompt & contextual engineering and applied prompt skills to automate a professional workflow. Credential ID: s2cc6beHPr2cxbmcN.",
    icon: "ShieldCheck",
    image: "/certs/vista-ai-in-action.png",
  },
  {
    title: "CM Punjab Laptop Awardee",
    tags: ["Academic"],
    body: "Awarded a laptop under the CM Punjab Laptop Scheme, a competitive provincial initiative recognizing high-achieving public sector university students with a proven track record of academic excellence.",
    icon: "GraduationCap",
    image: "/certs/cm-laptop-awardee.png",
  },
  {
    title: "Cricket Coordinator — PUCIT Sports Society",
    tags: ["Sports", "Soft Skills & Leadership"],
    body: "Certificate of Recognition from FCIT/PU for leading as Cricket Coordinator and organizing the Winter League 2025.",
    icon: "Flag",
    image: "/certs/cricket-coordinator-pucit.png",
  },
  {
    title: "CosmoCon '25 Web Hackathon Certification",
    tags: ["Technical"],
    body: "Competed with Team 'Web Wizards' at CosmoCon'25, building collaborative web tools under tight time pressure.",
    icon: "Code2",
    image: "/certs/cosmocon-25-participation.png",
  },
  {
    title: "LoopLab Ambassador — Certificate of Recognition",
    tags: ["Academic", "Soft Skills & Leadership"],
    body: "Recognized by LoopLab for exceptional commitment, professionalism, and leadership as a LoopVerse 2.0 Campus Ambassador.",
    icon: "Award",
    image: "/certs/looplab-ambassador-recognition.png",
  },
  {
    title: "Badminton Runner-up Certificate",
    tags: ["Sports"],
    body: "Secured 2nd position in the Badminton tournament at the Mini Olympics 2026, held at the FCIT New Campus.",
    icon: "Medal",
    image: "/certs/badminton-runner-up.jpeg",
  },
  {
    title: "SOFTEC Competitive Programming Certificate",
    tags: ["Technical"],
    body: "Awarded at SOFTEC for algorithmic problem solving, complexity reduction, and rapid program construction under contest conditions.",
    icon: "Trophy",
    image: "/certs/softec-competitive-programming.png",
  },
  {
    title: "FDC Summer Bootcamp 2025 — Campus Ambassador",
    tags: ["Academic", "Soft Skills & Leadership"],
    body: "Certificate of Recognition from the FCIT Developer's Club for serving as Campus Ambassador for the FDC Summer Bootcamp 2025.",
    icon: "Award",
    image: "/certs/fdc-summer-bootcamp-2025.png",
  },
  {
    title: "Jenga Runner-up Certificate",
    tags: ["Sports"],
    body: "Secured 2nd position in the Jenga competition at the Mini Olympics 2026, held at the PUCIT New Campus.",
    icon: "Medal",
    image: "/certs/jenga-runner-up.jpeg",
  },
  {
    title: "Introduction to Excel",
    tags: ["Technical"],
    body: "Coursera project certificate (Nov 2024) — Getting Started with Microsoft Excel, covering structured data entry, formatting, and core spreadsheet workflows.",
    icon: "FileSpreadsheet",
    image: "/certs/intro-to-excel.png",
  },
  {
    title: "Mini Olympics 2026 — Event Coordinator",
    tags: ["Sports", "Soft Skills & Leadership"],
    body: "Recognized by FCIT Sports Society for serving as Event Coordinator and supporting the successful organization of the Mini Olympics 2026.",
    icon: "Flag",
    image: "/certs/mini-olympics-event-coordinator.png",
  },
];

import {
  Award,
  ShieldCheck,
  Code2,
  Trophy,
  FileSpreadsheet,
  GraduationCap,
  Medal,
  Flag,
} from "lucide-react";

export const CERT_ICONS = {
  Award,
  ShieldCheck,
  Code2,
  Trophy,
  FileSpreadsheet,
  GraduationCap,
  Medal,
  Flag,
} as const;