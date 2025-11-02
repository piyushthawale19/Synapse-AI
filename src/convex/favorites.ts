import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const add = mutation({
  args: {
    itemType: v.union(
      v.literal("trial"),
      v.literal("expert"),
      v.literal("publication"),
    ),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("itemType"), args.itemType),
          q.eq(q.field("itemId"), args.itemId)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("favorites", {
      userId: user._id,
      ...args,
    });
  },
});

export const remove = mutation({
  args: {
    itemType: v.union(
      v.literal("trial"),
      v.literal("expert"),
      v.literal("publication"),
    ),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("itemType"), args.itemType),
          q.eq(q.field("itemId"), args.itemId)
        )
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const listByUser = query({
  args: {
    itemType: v.optional(
      v.union(
        v.literal("trial"),
        v.literal("expert"),
        v.literal("publication"),
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    let favoritesQuery = ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    const favorites = await favoritesQuery.collect();

    if (args.itemType) {
      return favorites.filter((f) => f.itemType === args.itemType);
    }

    return favorites;
  },
});
