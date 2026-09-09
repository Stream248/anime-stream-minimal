import { cn } from "@/lib/utils";
import type { TrendingAnime } from "@/hooks/use-trending-anime";

function compact(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

/**
 * Minimal trending card: poster, rank, title, one metadata line. No boxes,
 * no shadows — separation comes from spacing and the poster's own edge.
 */
export function AnimeCard({ anime }: { anime: TrendingAnime }) {
  const meta = [
    anime.type,
    anime.year,
    anime.episodes ? `${anime.episodes} ep` : undefined,
    anime.score ? `★ ${anime.score.toFixed(1)}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <a
      href={`https://myanimelist.net/anime/${anime.malId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
        {anime.imageUrl ? (
          <img
            src={anime.imageUrl}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-sm bg-background/85 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-foreground backdrop-blur-sm">
          #{anime.rank}
        </span>
      </div>
      <div className="mt-3">
        <p className="truncate text-sm font-medium text-foreground group-hover:underline group-focus-visible:underline">
          {anime.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {meta || "—"}
        </p>
      </div>
    </a>
  );
}

/**
 * Responsive 2→6 column grid; the explicit grid keeps the poster rhythm
 * perfectly aligned at every breakpoint, which is the core of the look.
 */
export function TrendingGrid({ anime }: { anime: TrendingAnime[] }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
      )}
    >
      {anime.map((item) => (
        <AnimeCard key={item.malId} anime={item} />
      ))}
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-muted" />
          <div className="mt-3 h-3.5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
