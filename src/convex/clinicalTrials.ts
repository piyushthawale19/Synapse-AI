import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    aiSummary: v.optional(v.string()),
    eligibilityCriteria: v.string(),
    phase: v.union(
      v.literal("phase_1"),
      v.literal("phase_2"),
      v.literal("phase_3"),
      v.literal("phase_4"),
      v.literal("not_applicable"),
    ),
    status: v.union(
      v.literal("recruiting"),
      v.literal("not_recruiting"),
      v.literal("completed"),
      v.literal("suspended"),
    ),
    location: v.object({
      city: v.string(),
      country: v.string(),
    }),
    contactEmail: v.string(),
    conditions: v.array(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "researcher") {
      throw new Error("Only researchers can create clinical trials");
    }

    return await ctx.db.insert("clinicalTrials", {
      ...args,
      createdBy: user._id,
    });
  },
});

export const list = query({
  args: {
    status: v.optional(v.string()),
    condition: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let trials = await ctx.db.query("clinicalTrials").collect();

    if (args.status) {
      trials = trials.filter((t) => t.status === args.status);
    }

    if (args.condition) {
      trials = trials.filter((t) =>
        t.conditions.some((c) =>
          c.toLowerCase().includes(args.condition!.toLowerCase())
        )
      );
    }

    return trials;
  },
});

export const getById = query({
  args: { id: v.id("clinicalTrials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getRecommendedForPatient = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user.medicalConditions) {
      return [];
    }

    const allTrials = await ctx.db.query("clinicalTrials").collect();
    
    return allTrials.filter((trial) =>
      trial.conditions.some((condition) =>
        user.medicalConditions!.some((userCondition) =>
          condition.toLowerCase().includes(userCondition.toLowerCase()) ||
          userCondition.toLowerCase().includes(condition.toLowerCase())
        )
      )
    ).slice(0, 10);
  },
});

export const update = mutation({
  args: {
    id: v.id("clinicalTrials"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("recruiting"),
        v.literal("not_recruiting"),
        v.literal("completed"),
        v.literal("suspended"),
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const trial = await ctx.db.get(args.id);
    
    if (!trial) {
      throw new Error("Trial not found");
    }
    
    if (!user || trial.createdBy !== user._id) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});
