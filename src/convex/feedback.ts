import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submitFeedback = mutation({
  args: {
    kind: v.union(v.literal("issue"), v.literal("suggestion")),
    message: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const message = args.message.trim();
    if (message.length < 3) {
      throw new Error("Please write at least a few words before submitting.");
    }
    if (message.length > 2000) {
      throw new Error("Please keep feedback under 2,000 characters.");
    }
    if (args.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new Error("That email address doesn't look right.");
    }

    await ctx.db.insert("feedback", {
      kind: args.kind,
      message,
      email: args.email?.trim() || undefined,
    });
  },
});

export const getFeedbackCount = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("feedback").collect()).length;
  },
});
