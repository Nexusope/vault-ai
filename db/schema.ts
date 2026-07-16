import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ideas = sqliteTable("ideas", {
  id: text("id").primaryKey(),
  source: text("source").notNull().default("manual"),
  sourceUrl: text("source_url"),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  creator: text("creator").notNull().default("unknown"),
  mediaType: text("media_type").notNull().default("post"),
  transcript: text("transcript"),
  tags: text("tags").notNull().default("[]"),
  trendScore: real("trend_score").notNull().default(0),
  confidence: real("confidence").notNull().default(0),
  status: text("status").notNull().default("ready"),
  collectionId: text("collection_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("ideas_created_idx").on(table.createdAt), index("ideas_trend_idx").on(table.trendScore)]);

export const collections = sqliteTable("collections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  color: text("color").notNull().default("#b6ff3b"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const imports = sqliteTable("imports", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  sourceRef: text("source_ref").notNull(),
  state: text("state").notNull().default("queued"),
  progress: integer("progress").notNull().default(0),
  error: text("error"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
