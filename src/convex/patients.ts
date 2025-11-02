import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const updateProfile = mutation({
  args: {
    medicalConditions: v.optional(v.array(v.string())),
    location: v.optional(
      v.object({
        city: v.string(),
        country: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    await ctx.db.patch(user._id, args);
  },
});

export const followExpert = mutation({
  args: {
    expertId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const existing = await ctx.db
      .query("followRelationships")
      .withIndex("by_follower", (q) => q.eq("followerId", user._id))
      .filter((q) => q.eq(q.field("followingId"), args.expertId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("followRelationships", {
      followerId: user._id,
      followingId: args.expertId,
    });
  },
});

export const unfollowExpert = mutation({
  args: {
    expertId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const relationship = await ctx.db
      .query("followRelationships")
      .withIndex("by_follower", (q) => q.eq("followerId", user._id))
      .filter((q) => q.eq(q.field("followingId"), args.expertId))
      .first();

    if (relationship) {
      await ctx.db.delete(relationship._id);
    }
  },
});
