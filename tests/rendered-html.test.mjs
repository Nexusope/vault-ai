import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

test("finished Vault AI source replaces every starter surface", async () => {
  const [page, component, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/vault-app.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /VaultApp initialView="dashboard"/);
  assert.match(component, /CREATE FROM/);
  assert.match(component, /OPPORTUNITY RADAR/);
  assert.match(component, /href=\{`\/\$\{name\}`\}/);
  assert.match(layout, /VAULT\/\/AI/);
  assert.match(layout, /og\.png/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(page + component + layout, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("API source validates before database or provider work", async () => {
  const [ideas, ai, db] = await Promise.all([
    readFile(new URL("../app/api/ideas/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/ai/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/index.ts", import.meta.url), "utf8"),
  ]);
  assert.match(ideas, /safeParse/); assert.match(ideas, /status: 400/); assert.match(ideas, /await ensureSchema/);
  assert.match(ai, /safeParse/); assert.match(ai, /status: 400/); assert.match(ai, /routeAI/);
  assert.match(db, /CREATE TABLE IF NOT EXISTS ideas/); assert.match(db, /env\.DB\.batch/);
});

test("ships complete blueprint, agents, skills, prompts, and project asset", async () => {
  const [docs, agents, skills, prompts, image] = await Promise.all([
    readdir(new URL("../docs/", import.meta.url)), readdir(new URL("../agents/", import.meta.url)),
    readdir(new URL("../skills/", import.meta.url)), readdir(new URL("../prompts/", import.meta.url)),
    stat(new URL("../public/og.png", import.meta.url)),
  ]);
  assert.equal(docs.filter((file) => file.endsWith(".md")).length, 35);
  assert.equal(agents.filter((file) => file.endsWith(".md")).length, 18);
  assert.equal(skills.filter((file) => file.endsWith(".md")).length, 33);
  assert.equal(prompts.filter((file) => file.endsWith(".md")).length, 11);
  assert.ok(image.size > 100_000);
  await access(new URL("../dist/server/index.js", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("never commits provider key material into application text files", async () => {
  const files = ["README.md", "lib/ai-providers.ts", "app/layout.tsx", "components/vault-app.tsx"];
  const text = (await Promise.all(files.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")))).join("\n");
  assert.doesNotMatch(text, /sk-or-v1-|nvapi-|gsk_|AIzaSy|csk-/);
});
