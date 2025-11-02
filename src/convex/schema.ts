import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  PATIENT: "patient",
  RESEARCHER: "researcher",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.PATIENT),
  v.literal(ROLES.RESEARCHER),
);
export type Role = Infer<typeof roleValidator>;

export const recruitmentStatusValidator = v.union(
  v.literal("recruiting"),
  v.literal("not_recruiting"),
  v.literal("completed"),
  v.literal("suspended"),
);

export const trialPhaseValidator = v.union(
  v.literal("phase_1"),
  v.literal("phase_2"),
  v.literal("phase_3"),
  v.literal("phase_4"),
  v.literal("not_applicable"),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      
      // Patient-specific fields
      medicalConditions: v.optional(v.array(v.string())),
      location: v.optional(v.object({
        city: v.string(),
        country: v.string(),
      })),
      
      // Researcher-specific fields
      specialties: v.optional(v.array(v.string())),
      researchInterests: v.optional(v.array(v.string())),
      availableForMeetings: v.optional(v.boolean()),
      orcidId: v.optional(v.string()),
      researchGateId: v.optional(v.string()),
      bio: v.optional(v.string()),
      institution: v.optional(v.string()),
    })
      .index("email", ["email"])
      .index("by_role", ["role"]),

    clinicalTrials: defineTable({
      title: v.string(),
      description: v.string(),
      aiSummary: v.optional(v.string()),
      eligibilityCriteria: v.string(),
      phase: trialPhaseValidator,
      status: recruitmentStatusValidator,
      location: v.object({
        city: v.string(),
        country: v.string(),
      }),
      contactEmail: v.string(),
      conditions: v.array(v.string()),
      createdBy: v.optional(v.id("users")),
      externalId: v.optional(v.string()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
    })
      .index("by_status", ["status"])
      .index("by_created_by", ["createdBy"]),

    publications: defineTable({
      title: v.string(),
      authors: v.array(v.string()),
      abstract: v.string(),
      aiSummary: v.optional(v.string()),
      publicationDate: v.string(),
      journal: v.optional(v.string()),
      doi: v.optional(v.string()),
      pubmedId: v.optional(v.string()),
      keywords: v.array(v.string()),
      researcherId: v.optional(v.id("users")),
    })
      .index("by_researcher", ["researcherId"]),

    favorites: defineTable({
      userId: v.id("users"),
      itemType: v.union(
        v.literal("trial"),
        v.literal("expert"),
        v.literal("publication"),
      ),
      itemId: v.string(),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_type", ["userId", "itemType"]),

    forumCommunities: defineTable({
      name: v.string(),
      description: v.string(),
      category: v.string(),
      createdBy: v.id("users"),
    })
      .index("by_category", ["category"]),

    forumPosts: defineTable({
      communityId: v.id("forumCommunities"),
      authorId: v.id("users"),
      title: v.string(),
      content: v.string(),
      isQuestion: v.boolean(),
    })
      .index("by_community", ["communityId"])
      .index("by_author", ["authorId"]),

    forumReplies: defineTable({
      postId: v.id("forumPosts"),
      authorId: v.id("users"),
      content: v.string(),
    })
      .index("by_post", ["postId"])
      .index("by_author", ["authorId"]),

    connectionRequests: defineTable({
      fromUserId: v.id("users"),
      toUserId: v.id("users"),
      status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("rejected"),
      ),
      message: v.optional(v.string()),
    })
      .index("by_from_user", ["fromUserId"])
      .index("by_to_user", ["toUserId"])
      .index("by_status", ["status"]),

    messages: defineTable({
      fromUserId: v.id("users"),
      toUserId: v.id("users"),
      content: v.string(),
      read: v.boolean(),
    })
      .index("by_from_user", ["fromUserId"])
      .index("by_to_user", ["toUserId"]),

    followRelationships: defineTable({
      followerId: v.id("users"),
      followingId: v.id("users"),
    })
      .index("by_follower", ["followerId"])
      .index("by_following", ["followingId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;