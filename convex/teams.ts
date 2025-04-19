import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    const players = await ctx.db.query("players").collect(); // Single query for all players

    return teams.map(team => ({
      ...team,
      playerCount: players.filter(p => p.teamId === team._id).length
    }));
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db.insert("teams", { name });
  },
});