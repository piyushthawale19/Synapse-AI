import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    title: v.string(),
    authors: v.array(v.string()),
    abstract: v.string(),
    aiSummary: v.optional(v.string()),
    publicationDate: v.string(),
    journal: v.optional(v.string()),
    doi: v.optional(v.string()),
    pubmedId: v.optional(v.string()),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    return await ctx.db.insert("publications", {
      ...args,
      researcherId: user?._id,
    });
  },
});

export const listByResearcher = query({
  args: { researcherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("publications")
      .withIndex("by_researcher", (q) => q.eq("researcherId", args.researcherId))
      .collect();
  },
});

export const getRecommendedForPatient = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user.medicalConditions) {
      return [];
    }

    const allPublications = await ctx.db.query("publications").collect();
    
    return allPublications.filter((pub) =>
      pub.keywords.some((keyword) =>
        user.medicalConditions!.some((condition) =>
          keyword.toLowerCase().includes(condition.toLowerCase()) ||
          condition.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    ).slice(0, 10);
  },
});
