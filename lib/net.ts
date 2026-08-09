// Next.js App Router route handlers have no built-in, trustworthy way to
// read the client IP (no `request.ip`). This reads forwarded headers, which
// are only trustworthy behind a reverse proxy that overwrites
// client-supplied values — that's Phase 12 (Caddy), not yet in place. Until
// then, a client can trivially spoof these headers to dodge IP-based rate
// limiting; treat this as best-effort, not a security boundary on its own.
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
