import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: { teamId: v.optional(v.id("teams")) },
  handler: async (ctx, { teamId }) => {
    const query = teamId 
      ? ctx.db.query("players").withIndex("by_team", q => q.eq("teamId", teamId))
      : ctx.db.query("players");
      
    const players = await query.collect();
    return Promise.all(players.map(async (player) => ({
      ...player,
      photoUrl: player.photo ? await ctx.storage.getUrl(player.photo) : null
    })));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    birthday: v.string(),
    teamId: v.id("teams"),
    photo: v.optional(v.id("_storage"))
  },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Invalid team ID");
    return await ctx.db.insert("players", args);
  },
});