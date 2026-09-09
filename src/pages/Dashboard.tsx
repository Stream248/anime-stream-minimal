import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { BannerAd } from "@/components/BannerAd";
import { TrendingGrid, TrendingSkeleton } from "@/components/TrendingGrid";
import { useTrendingAnime } from "@/hooks/use-trending-anime";
import { useAuth } from "@/hooks/use-auth";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router";

/**
 * The signed-in library: the same minimal trending list, framed for a member
 * with member framing (greeting, refresh status, sidebar ad on wide screens).
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { anime, isLoading } = useTrendingAnime();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pt-14 pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Your Library
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Here's what viewers with tastes like yours are watching right now.
            Rankings refresh every six hours from MyAnimeList.
          </p>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="h-px bg-border/80" />
        </div>

        <section className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Picked for you · Trending
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="size-3" />
              {isLoading ? "Syncing…" : `${anime?.length ?? 0} titles`}
            </span>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_200px]">
            <div>
              {isLoading ? (
                <TrendingSkeleton />
              ) : anime && anime.length > 0 ? (
                <TrendingGrid anime={anime} />
              ) : (
                <div className="flex flex-col items-start gap-3 border border-dashed border-border/70 rounded-md p-10">
                  <p className="text-sm text-muted-foreground">
                    The catalog is syncing right now — check back in a moment.
                  </p>
                  <Link to="/" className="text-sm underline underline-offset-4">
                    Back to home
                  </Link>
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <AdSlot slot="library-sidebar" minHeight={400} />
              </div>
            </aside>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6 mb-12">
          <BannerAd />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
