import type { Metadata, Viewport } from "next";

// Self-hosted variable fonts (no runtime/build-time Google Fonts fetch).
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";

import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SceneBackground } from "@/components/three/scene-background";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rorry Ramos — Full-Stack Developer",
  description:
    "Portfolio of Rorry Ramos, a full-stack developer building modern web applications with Next.js, React, and Supabase.",
};

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-loading="true"
      suppressHydrationWarning
    >
      <body>
        {/* Without JS the preloader would never finish — don't trap the page. */}
        <noscript>
          <style>{`#preloader{display:none!important}html[data-loading]{overflow:auto!important}`}</style>
        </noscript>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Preloader />
        <SceneBackground />
        {children}
      </body>
    </html>
  );
}
