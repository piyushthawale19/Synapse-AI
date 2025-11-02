import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createCommunity = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "researcher") {
      throw new Error("Only researchers can create communities");
    }

    return await ctx.db.insert("forumCommunities", {
      ...args,
      createdBy: user._id,
    });
  },
});

export const listCommunities = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("forumCommunities").collect();
  },
});

export const createPost = mutation({
  args: {
    communityId: v.id("forumCommunities"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const isQuestion = user.role === "patient";

    return await ctx.db.insert("forumPosts", {
      ...args,
      authorId: user._id,
      isQuestion,
    });
  },
});

export const listPosts = query({
  args: { communityId: v.id("forumCommunities") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("forumPosts")
      .withIndex("by_community", (q) => q.eq("communityId", args.communityId))
      .collect();

    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return { ...post, author };
      })
    );

    return postsWithAuthors;
  },
});

export const createReply = mutation({
  args: {
    postId: v.id("forumPosts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.isQuestion && user.role !== "researcher") {
      throw new Error("Only researchers can reply to patient questions");
    }

    return await ctx.db.insert("forumReplies", {
      ...args,
      authorId: user._id,
    });
  },
});

export const listReplies = query({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("forumReplies")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply) => {
        const author = await ctx.db.get(reply.authorId);
        return { ...reply, author };
      })
    );

    return repliesWithAuthors;
  },
});
