import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const port = Number(process.env.INSTAGRAM_BRIDGE_PORT || 4317);
let windowsCliEntry;
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
const server = createServer(async (request, response) => {
  response.setHeader("access-control-allow-origin", "http://localhost:3000");
  response.setHeader("access-control-allow-methods", "GET, OPTIONS");
  response.setHeader("content-type", "application/json; charset=utf-8");
  if (request.method === "OPTIONS") return response.end();
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (url.pathname === "/health") {
    const [version, identity] = await Promise.all([run(["--version"], 5_000), run(["auth", "whoami"], 5_000)]);
    const identityText = typeof identity.data === "string" ? identity.data : "";
    const authenticated = identity.ok && !/no active account/i.test(identityText);
    return response.end(JSON.stringify({ ok: version.ok, cli: version.data || "installed", authenticated, identity: authenticated ? identity.data : null }));
  }
  if (url.pathname === "/inbox") {
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 20), 1), 50);
    return response.end(JSON.stringify(await run(["inbox", "--limit", String(limit), "--output", "json"])));
  }
  response.statusCode = 404; response.end(JSON.stringify({ ok: false, error: "Not found" }));
});
server.listen(port, "127.0.0.1", () => console.log(`Vault Instagram bridge listening on http://127.0.0.1:${port}`));
