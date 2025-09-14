import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const publications = pgTable("publications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  abstract: text("abstract"),
  authors: jsonb("authors").$type<string[]>().default([]),
  publishedDate: timestamp("published_date"),
  doi: text("doi"),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  experimentTypes: jsonb("experiment_types").$type<string[]>().default([]),
  organisms: jsonb("organisms").$type<string[]>().default([]),
  spaceConditions: jsonb("space_conditions").$type<string[]>().default([]),
  mission: text("mission"),
  citationCount: integer("citation_count").default(0),
  viewCount: integer("view_count").default(0),
  aiSummary: text("ai_summary"),
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const experiments = pgTable("experiments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status").notNull(), // "active", "completed", "planned"
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  mission: text("mission"),
  organisms: jsonb("organisms").$type<string[]>().default([]),
  conditions: jsonb("conditions").$type<string[]>().default([]),
  objectives: jsonb("objectives").$type<string[]>().default([]),
  results: text("results"),
  publicationIds: jsonb("publication_ids").$type<string[]>().default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "correlation", "trend", "recommendation"
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: integer("confidence"), // 0-100
  relatedPublications: jsonb("related_publications").$type<string[]>().default([]),
  relatedExperiments: jsonb("related_experiments").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertPublicationSchema = createInsertSchema(publications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExperimentSchema = createInsertSchema(experiments).omit({
  id: true,
  createdAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Publication = typeof publications.$inferSelect;

export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Experiment = typeof experiments.$inferSelect;

export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;

// Search and filter types
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  experimentTypes: z.array(z.string()).optional(),
  organisms: z.array(z.string()).optional(),
  spaceConditions: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  mission: z.string().optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
