import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSlot } from "@/components/AdSlot";
import { AnimeCard } from "@/components/TrendingGrid";
import type { TrendingAnime } from "@/hooks/use-trending-anime";
import { Loader2, SearchX } from "lucide-react";

type SearchState = "idle" | "loading" | "done" | "error";

/**
 * Public catalog search. Results come straight from Jikan via a Convex
 * action; typing is debounced so we stay inside the API's rate limits.
 */
export default function Search() {
  const searchAnime = useAction(api.trending.searchAnime);
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debounced, setDebounced] = useState(query.trim());
  const [results, setResults] = useState<TrendingAnime[] | null>(null);
  const [state, setState] = useState<SearchState>("idle");

  // Debounce typing into the actual query.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Keep the URL shareable (?q=...), and clear it when the query does.
  useEffect(() => {
    if (debounced.length >= 2) {
      setSearchParams({ q: debounced }, { replace: true });
    } else if (searchParams.has("q")) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Run the search when the debounced query changes.
  useEffect(() => {
    let cancelled = false;

    if (debounced.length < 2) {
      setResults(null);
      setState("idle");
      return;
    }

    setState("loading");
    searchAnime({ q: debounced })
      .then((r) => {
        if (!cancelled) {
          setResults(r as TrendingAnime[]);
          setState("done");
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, searchAnime]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Search
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Find something that fits your taste.
          </h1>

          <div className="mt-10 max-w-2xl">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title — “Frieren”, “Monster”, “Vinland”…"
              autoFocus
              className="w-full border-0 border-b border-border bg-transparent pb-3 text-lg text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none sm:text-xl"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Results are ordered by community popularity, so the best-known
              match usually appears first.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-16">
          {state === "idle" && (
            <div className="border border-dashed border-border/70 rounded-md p-10">
              <p className="text-sm text-muted-foreground">
                Start typing to search the full catalog — no account required.
              </p>
            </div>
          )}

          {state === "loading" && (
            <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Searching…
            </div>
          )}

          {state === "error" && (
            <div className="border border-dashed border-border/70 rounded-md p-10">
              <p className="text-sm text-muted-foreground">
                Search didn't respond just then. Give it another moment and
                try again.
              </p>
            </div>
          )}

          {state === "done" && results && results.length === 0 && (
            <div className="flex flex-col items-start gap-3 border border-dashed border-border/70 rounded-md p-10">
              <SearchX className="size-5 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                Nothing matched “{debounced}”. Try a shorter or alternative
                title — Japanese and English names both work.
              </p>
            </div>
          )}

          {state === "done" && results && results.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"}{" "}
                for “{debounced}”
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {results.map((item) => (
                  <AnimeCard
                    key={item.malId}
                    anime={item}
                    showRank={false}
                  />
                ))}
              </div>
              <div className="mt-14">
                <AdSlot slot="search-bottom" minHeight={90} />
              </div>
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
