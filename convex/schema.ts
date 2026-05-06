import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  testimonials: defineTable({
    author: v.string(),
    role: v.string(),
    text: v.string(),
    rating: v.number(),
  }),
});
