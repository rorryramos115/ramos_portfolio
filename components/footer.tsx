export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-background/60 py-8 backdrop-blur-md">
      <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Rorry Ramos. Built with Next.js.</p>
        <p className="font-mono">Alubijid, Misamis Oriental · GMT+8</p>
      </div>
    </footer>
  );
}
