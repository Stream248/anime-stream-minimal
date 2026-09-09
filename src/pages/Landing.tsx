import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Compass, Fingerprint, MonitorPlay } from "lucide-react";
import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { TrendingGrid, TrendingSkeleton } from "@/components/TrendingGrid";
import { useTrendingAnime } from "@/hooks/use-trending-anime";

const FEATURES = [
  {
    icon: Compass,
    title: "A curated index",
    body: "Top titles, one calm list. No feeds, no noise — just what the community is watching right now.",
  },
  {
    icon: Fingerprint,
    title: "Built to be read",
    body: "Near-monochrome, generous spacing, hairline dividers. The catalog is the interface.",
  },
  {
    icon: MonitorPlay,
    title: "Free to browse",
    body: "Every rank, score and metadata line is public. An ad keeps it that way — no account required.",
  },
  {
    icon: BarChart3,
    title: "Live rankings",
    body: "The list refreshes from Jikan (MyAnimeList) every six hours, so trending stays trending.",
  },
];

export default function Landing() {
  const { anime, isLoading } = useTrendingAnime();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-14 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Anime &amp; Manga
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
              Every series worth your evening, on one quiet page.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Aniverse is a minimal library of anime and manga. Browse what's
              trending, check a score, and move on — no clutter, no accounts,
              no noise.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Browse trending
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#trending"
                className="inline-flex h-11 items-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See what's popular ↓
              </a>
            </div>
          </motion.div>

          {/* Top banner ad — above the fold, content to the right */}
          <div className="mt-16">
            <AdSlot slot="home-top-banner" minHeight={90} />
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="h-px bg-border/80" />
        </div>

        {/* Trending */}
        <section id="trending" className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Trending now</h2>
            <p className="text-xs text-muted-foreground">
              By popularity · Updated every 6 hours
            </p>
          </div>
          <div className="mt-8">
            {isLoading ? <TrendingSkeleton /> : <TrendingGrid anime={anime ?? []} />}
          </div>
        </section>

        {/* In-feed ad between list sections */}
        <div className="mx-auto w-full max-w-6xl px-6">
          <AdSlot slot="home-in-feed" minHeight={120} label="Sponsored" />
        </div>

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="text-xl font-semibold tracking-tight">
            Why Aniverse feels different
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <f.icon className="size-5 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mt-4 text-sm font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-y border-border/80">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Start with what everyone is watching.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Create a free account to keep browsing past the public list, or
              sign in if you already have one.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/auth?returnTo=/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create free account
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
