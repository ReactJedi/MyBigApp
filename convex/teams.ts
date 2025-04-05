import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return Promise.all(teams.map(async (team) => {
      const players = await ctx.db
        .query("players")
        .withIndex("by_team", (q) => q.eq("teamId", team._id))
        .collect();
      return { ...team, playerCount: players.length };
    }));
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db.insert("teams", { name });
  },
});