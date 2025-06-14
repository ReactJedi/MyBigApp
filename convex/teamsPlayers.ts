// convex/teamsPlayers.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTeamAndPlayer = mutation({
  args: {
    teamName: v.string(),
    playerName: v.string(),
    playerBirthday: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Create team
    const teamId = await ctx.db.insert("teams", {
      name: args.teamName
    });

    // Create player linked to user
    await ctx.db.insert("players", {
      name: args.playerName,
      birthday: args.playerBirthday,
      teamId,
      userId: identity.subject
    });

    return teamId;
  }
});