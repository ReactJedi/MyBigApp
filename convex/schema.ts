import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
  }),
  players: defineTable({
    name: v.string(),
    birthday: v.string(),
    teamId: v.id("teams"),
    photo: v.optional(v.id("_storage")),
    userId: v.string(), // <-- Add this line!
  }).index("by_team", ["teamId"])
});