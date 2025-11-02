import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const updateProfile = mutation({
  args: {
    specialties: v.optional(v.array(v.string())),
    researchInterests: v.optional(v.array(v.string())),
    availableForMeetings: v.optional(v.boolean()),
    orcidId: v.optional(v.string()),
    researchGateId: v.optional(v.string()),
    bio: v.optional(v.string()),
    institution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    await ctx.db.patch(user._id, args);
  },
});

export const searchCollaborators = query({
  args: {
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const researchers = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "researcher"))
      .collect();

    if (!args.searchTerm) {
      return researchers;
    }

    const term = args.searchTerm.toLowerCase();
    return researchers.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.specialties?.some((s) => s.toLowerCase().includes(term)) ||
        r.researchInterests?.some((i) => i.toLowerCase().includes(term))
    );
  },
});

export const getRecommendedExperts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user.medicalConditions) {
      return [];
    }

    const researchers = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "researcher"))
      .collect();

    return researchers.filter((researcher) =>
      researcher.specialties?.some((specialty) =>
        user.medicalConditions!.some((condition) =>
          specialty.toLowerCase().includes(condition.toLowerCase()) ||
          condition.toLowerCase().includes(specialty.toLowerCase())
        )
      )
    ).slice(0, 10);
  },
});

export const sendConnectionRequest = mutation({
  args: {
    toUserId: v.id("users"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    return await ctx.db.insert("connectionRequests", {
      fromUserId: user._id,
      toUserId: args.toUserId,
      status: "pending",
      message: args.message,
    });
  },
});

export const respondToConnectionRequest = mutation({
  args: {
    requestId: v.id("connectionRequests"),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request || request.toUserId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.requestId, {
      status: args.accept ? "accepted" : "rejected",
    });
  },
});

export const listConnectionRequests = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const requests = await ctx.db
      .query("connectionRequests")
      .withIndex("by_to_user", (q) => q.eq("toUserId", user._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const requestsWithUsers = await Promise.all(
      requests.map(async (req) => {
        const fromUser = await ctx.db.get(req.fromUserId);
        return { ...req, fromUser };
      })
    );

    return requestsWithUsers;
  },
});
