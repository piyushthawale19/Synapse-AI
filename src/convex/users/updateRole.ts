import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getCurrentUser } from "../users";

export const updateRole = mutation({
  args: {
    role: v.union(v.literal("patient"), v.literal("researcher")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    await ctx.db.patch(user._id, { role: args.role });
  },
});
