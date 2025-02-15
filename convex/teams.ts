import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// non-paginated query for transactions form
export const get = query({
  handler: async (ctx) => {

    return await ctx.db
      .query("teams")
      .collect(); // Fetch all documents
  },
});

