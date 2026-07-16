import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

export async function ensureSchema() {
  if (!env.DB) throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS ideas (id TEXT PRIMARY KEY NOT NULL, source TEXT DEFAULT 'manual' NOT NULL, source_url TEXT, title TEXT NOT NULL, summary TEXT DEFAULT '' NOT NULL, creator TEXT DEFAULT 'unknown' NOT NULL, media_type TEXT DEFAULT 'post' NOT NULL, transcript TEXT, tags TEXT DEFAULT '[]' NOT NULL, trend_score REAL DEFAULT 0 NOT NULL, confidence REAL DEFAULT 0 NOT NULL, status TEXT DEFAULT 'ready' NOT NULL, collection_id TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS ideas_created_idx ON ideas (created_at)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS ideas_trend_idx ON ideas (trend_score)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS collections (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT DEFAULT '' NOT NULL, color TEXT DEFAULT '#b6ff3b' NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS imports (id TEXT PRIMARY KEY NOT NULL, source TEXT NOT NULL, source_ref TEXT NOT NULL, state TEXT DEFAULT 'queued' NOT NULL, progress INTEGER DEFAULT 0 NOT NULL, error TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL, completed_at TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, read INTEGER DEFAULT false NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)"),
  ]);
}
