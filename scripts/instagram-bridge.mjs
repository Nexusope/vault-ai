import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const port = Number(process.env.INSTAGRAM_BRIDGE_PORT || 4317);
let windowsCliEntry;
let versionCache;
let presenceCache;
async function cliCommand(args) {
  if (process.platform !== "win32") return { executable: "instagram-cli", args };
  if (!windowsCliEntry) {
    const { stdout } = await exec("where.exe", ["instagram-cli.cmd"], { windowsHide: true });
    const shim = stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
    if (!shim) throw new Error("instagram-cli.cmd was not found on PATH");
    windowsCliEntry = join(dirname(shim), "node_modules", "@i7m", "instagram-cli", "dist", "cli.js");
  }
  return { executable: process.execPath, args: [windowsCliEntry, ...args] };
}
async function run(args, timeout = 30_000) {
  try {
    const command = await cliCommand(args);
    const { stdout } = await exec(command.executable, command.args, { timeout, windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
    const trimmed = stdout.trim();
    try { return JSON.parse(trimmed); } catch { return { ok: true, data: trimmed }; }
  } catch (error) { return { ok: false, error: error.stderr?.trim() || error.stdout?.trim() || error.message }; }
}
async function getCliVersion() {
  if (versionCache) return versionCache;
  const version = await run(["--version"], 5_000);
  if (version.ok) versionCache = version;
  return version;
}
async function getCliPresence() {
  if (presenceCache) return presenceCache;
  try {
    const command = await cliCommand([]);
    if (process.platform === "win32") await access(command.args[0]);
    presenceCache = { ok: true };
  } catch (error) {
    presenceCache = { ok: false, error: error instanceof Error ? error.message : "instagram-cli was not found" };
  }
  return presenceCache;
}
async function getSessionState() {
  try {
    const configPath = process.env.INSTAGRAM_CLI_CONFIG || join(homedir(), ".instagram-cli", "config.ts.yaml");
    const config = await readFile(configPath, "utf8");
    const username = config.match(/^\s*currentUsername:\s*["']?([^"'#\r\n]+?)["']?\s*$/m)?.[1]?.trim();
    if (!username || username === "null" || username === "undefined") return { authenticated: false, identity: null };
    const configuredDir = config.match(/^\s*usersDir:\s*["']?([^"'#\r\n]+?)["']?\s*$/m)?.[1]?.trim();
    const usersDir = configuredDir || join(homedir(), ".instagram-cli", "users");
    await access(join(usersDir, username, "session.ts.json"));
    return { authenticated: true, identity: `@${username}` };
  } catch {
    return { authenticated: false, identity: null };
  }
}
const server = createServer(async (request, response) => {
  response.setHeader("access-control-allow-origin", "http://localhost:3000");
  response.setHeader("access-control-allow-methods", "GET, OPTIONS");
  response.setHeader("content-type", "application/json; charset=utf-8");
  if (request.method === "OPTIONS") return response.end();
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (url.pathname === "/health") {
    const [presence, session] = await Promise.all([getCliPresence(), getSessionState()]);
    return response.end(JSON.stringify({ ok: presence.ok, cli: versionCache?.data || (presence.ok ? "installed" : "missing"), ...session }));
  }
  if (url.pathname === "/inbox") {
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 20), 1), 50);
    return response.end(JSON.stringify(await run(["inbox", "--limit", String(limit), "--output", "json"])));
  }
  response.statusCode = 404; response.end(JSON.stringify({ ok: false, error: "Not found" }));
});
server.listen(port, "127.0.0.1", () => console.log(`Vault Instagram bridge listening on http://127.0.0.1:${port}`));
void getCliVersion();
