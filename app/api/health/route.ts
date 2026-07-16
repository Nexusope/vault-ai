export async function GET() {
  return Response.json({ status: "ok", service: "vault-ai", version: "0.9.0", time: new Date().toISOString() });
}
