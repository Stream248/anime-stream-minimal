import { motion } from "framer-motion";
import { ArrowRight, Compass, MessagesSquare, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { TrendingGrid, TrendingSkeleton } from "@/components/TrendingGrid";
import { FeedbackSection } from "@/components/FeedbackSection";
import { useTrendingAnime } from "@/hooks/use-trending-anime";

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: "Matched to your taste",
    body: "Titles are ranked by what the community actually watches, so the list reads less like a database and more like a recommendation from a friend with similar taste.",
  },
  {
    icon: Search,
    title: "Search everything",
    body: "Remember half a title? Type it in. The full catalog is searchable — English or Japanese names, partial words, no account needed.",
  },
  {
    icon: MessagesSquare,
    title: "You shape the next version",
    body: "Report a problem or suggest an improvement in two clicks. Every note goes straight to the people building Comic Home.",
  },
  {
    icon: Compass,
    title: "Quiet by design",
    body: "One calm page, generous spacing, nothing blinking for your attention. Finding your next series shouldn't feel like work.",
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
              Anime &amp; manga recommendations
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
              Anime recommendations that actually match your taste.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Comic Home sorts the world of anime and manga into one readable
              list, ranked by what people like you are watching right now.
              Browse the trending chart or search the full catalog — then tell
              us what to improve.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Browse trending
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/search"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
              >
                <Search className="size-4" />
                Search the catalog
              </Link>
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
            <h2 className="text-xl font-semibold tracking-tight">
              Trending with viewers like you
            </h2>
            <p className="text-xs text-muted-foreground">
              Ranked by popularity · Refreshed every 6 hours
            </p>
          </div>
          <div className="mt-8">
            {isLoading ? <TrendingSkeleton /> : <TrendingGrid anime={anime ?? []} />}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Not seeing anything that fits?{" "}
            <Link to="/search" className="underline underline-offset-4 hover:text-foreground">
              Search the full catalog
            </Link>{" "}
            instead.
          </p>
        </section>

        {/* In-feed ad between list sections */}
        <div className="mx-auto w-full max-w-6xl px-6">
          <AdSlot slot="home-in-feed" minHeight={120} label="Sponsored" />
        </div>

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="text-xl font-semibold tracking-tight">
            Built around how you pick what to watch
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

        {/* Public feedback */}
        <FeedbackSection />

        {/* CTA */}
        <section>
          <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Start with what everyone is watching.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Create a free account to save your place and keep browsing, or
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
