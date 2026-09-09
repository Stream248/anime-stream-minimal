import { v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

const JIKAN_TOP_ANIME_URL =
  "https://api.jikan.moe/v4/top/anime?limit=24&filter=bypopularity";

interface JikanAnimeEntry {
  mal_id: number;
  title: string;
  images?: {
    jpg?: { image_url?: string; large_image_url?: string };
    webp?: { large_image_url?: string };
  };
  score?: number | null;
  episodes?: number | null;
  type?: string | null;
  year?: number | null;
  aired?: { prop?: { from?: { year?: number | null } } };
  members?: number | null;
  genres?: { name: string }[];
}

function mapEntry(entry: JikanAnimeEntry, rank: number) {
  return {
    malId: entry.mal_id,
    rank,
    title: entry.title,
    imageUrl:
      entry.images?.webp?.large_image_url ||
      entry.images?.jpg?.large_image_url ||
      entry.images?.jpg?.image_url ||
      "",
    score: entry.score ?? undefined,
    episodes: entry.episodes ?? undefined,
    type: entry.type ?? undefined,
    year: entry.year ?? entry.aired?.prop?.from?.year ?? undefined,
    members: entry.members ?? undefined,
    genres: (entry.genres ?? []).slice(0, 3).map((g) => g.name),
  };
}

/**
 * Fetches trending (by-popularity) anime from the Jikan API and caches the
 * result in the trendingAnime table. Runs as a scheduled refresh at most once
 * per REFRESH_INTERVAL_MS so we stay well inside Jikan's rate limits.
 */
export const refreshTrending = internalAction({
  args: {},
  handler: async (ctx) => {
    const res = await fetch(JIKAN_TOP_ANIME_URL);
    if (!res.ok) {
      throw new Error(`Jikan request failed: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as { data?: JikanAnimeEntry[] };
    const entries = data.data ?? [];

    await ctx.runMutation(internal.trending.replaceAll, {
      anime: entries.map(mapEntry),
    });
  },
});

const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Cheap, idempotent refresh check. The client calls this once on mount; it
 * no-ops when the cache is fresh and otherwise schedules a Jikan fetch.
 */
export const maybeRefreshTrending = mutation({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("trendingAnime")
      .withIndex("by_rank")
      .order("asc")
      .first();

    const now = Date.now();
    if (!latest || now - latest._creationTime > REFRESH_INTERVAL_MS) {
      await ctx.scheduler.runAfter(0, internal.trending.refreshTrending, {});
    }
  },
});

export const replaceAll = internalMutation({
  args: {
    anime: v.array(
      v.object({
        malId: v.number(),
        rank: v.number(),
        title: v.string(),
        imageUrl: v.string(),
        score: v.optional(v.number()),
        episodes: v.optional(v.number()),
        type: v.optional(v.string()),
        year: v.optional(v.number()),
        members: v.optional(v.number()),
        genres: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("trendingAnime").collect();
    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }
    for (const item of args.anime) {
      await ctx.db.insert("trendingAnime", item);
  }
  },
});

/**
 * Public query used by the UI. Serves the cached top-anime list; freshness is
 * handled by the client calling maybeRefreshTrending once on mount.
 */
export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("trendingAnime")
      .withIndex("by_rank")
      .order("asc")
      .take(24);

    return rows.map((row) => ({
      malId: row.malId,
      rank: row.rank,
      title: row.title,
      imageUrl: row.imageUrl,
      score: row.score,
      episodes: row.episodes,
      type: row.type,
      year: row.year,
      members: row.members,
      genres: row.genres,
    }));
  },
});
