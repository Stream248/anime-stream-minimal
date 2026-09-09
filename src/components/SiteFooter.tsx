import { BannerAd } from "@/components/BannerAd";

/**
 * Quiet footer: bottom leaderboard ad slot, a metadata line, and small print.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <BannerAd className="mb-10" />
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Comic Home — anime and manga recommendations matched to your
            taste. Catalog data from Jikan (MyAnimeList).
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Comic Home. Ads keep it free.
          </p>
        </div>
      </div>
    </footer>
  );
}
