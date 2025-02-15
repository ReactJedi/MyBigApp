import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    name: v.string(),
    teamId: v.optional(v.id("teams")), // Reference to teams table
  }),

  teams: defineTable({
    name: v.string(), // Team name
  }),
});
