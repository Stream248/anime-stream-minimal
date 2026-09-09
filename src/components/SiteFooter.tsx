import { AdSlot } from "@/components/AdSlot";

/**
 * Quiet footer: bottom leaderboard ad slot, a metadata line, and small print.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <AdSlot slot="footer-leaderboard" className="mb-10" minHeight={90} />
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Aniverse — a minimal anime &amp; manga index. Catalog data from
            Jikan (MyAnimeList).
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Aniverse. Ads keep the lights on.
          </p>
        </div>
      </div>
    </footer>
  );
}
