export type Project = {
  id: string;
  title: string;
  year: string;
  role: string;
  description: string;
  tags: string[];
  color: string;
  image: string; // TODO: replace placeholder with real screenshot
  liveUrl?: string;
  githubUrl?: string;
};

const GITHUB = "https://github.com/rorryramos115";

export const projects: Project[] = [
  {
    id: "kurostream",
    title: "KuroStream",
    year: "2025",
    role: "Frontend design & engineering",
    description:
      "An anime streaming frontend concept — browsing, discovery, and a watch experience built as a design-forward interface exercise.",
    tags: ["React", "Tailwind CSS", "Frontend Design"],
    color: "0 65% 55%",
    image: "/projects/koru-stream.png",
    liveUrl: "https://koru-stream.vercel.app/",
    githubUrl: GITHUB,
  },
  {
    id: "prepwise",
    title: "PrepWise",
    year: "2025",
    role: "Full-stack engineer",
    description:
      "An AI-powered mock interview platform — practice job interviews with a voice AI agent that asks questions and gives feedback in real time.",
    tags: ["Next.js", "Vapi", "Firebase"],
    color: "265 45% 55%",
    image: "/projects/interview-gpt.png",
    liveUrl: "https://interview-gpt-mu.vercel.app/",
    githubUrl: GITHUB,
  },
  {
    id: "zentry",
    title: "Zentry",
    year: "2025",
    role: "Frontend engineer",
    description:
      "A cinematic gaming-brand landing page clone — scroll-driven storytelling, video reveals, and heavy motion work built to sharpen GSAP animation chops.",
    tags: ["Next.js", "GSAP", "Tailwind CSS"],
    color: "150 30% 40%",
    image: "/projects/zentry.png",
    liveUrl: "https://zentry-one-psi.vercel.app/",
    githubUrl: GITHUB,
  },
  {
    id: "meedo-waterworks",
    title: "Meedo Waterworks Alubijid",
    year: "2026",
    role: "Full-stack engineer",
    description:
      "A live water billing management system for a local Philippine water utility — handles consumers, meter readings, billing, payments, and maintenance job orders in one platform.",
    tags: ["Next.js", "Supabase", "shadcn/ui", "Resend"],
    color: "205 55% 42%",
    image: "/projects/meedo-alubijid-waterworks.png",
    liveUrl: "https://www.meedo-alubijid-waterworks.com/",
    githubUrl: GITHUB,
  },
  {
    id: "modernshop",
    title: "ModernShop",
    year: "2025",
    role: "Frontend engineer",
    description:
      "A modern e-commerce storefront — curated product grid, cart, and checkout flow with smooth page transitions and micro-interactions throughout.",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS"],
    color: "34 55% 55%",
    image: "/projects/e-commerse-web.png",
    liveUrl: "https://e-commerse-web-app.vercel.app/",
    githubUrl: GITHUB,
  },
];