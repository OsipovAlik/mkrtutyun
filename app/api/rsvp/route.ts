import { isAdmin } from "@/lib/admin-auth";
import { listRsvps, saveRsvp, summarize } from "@/lib/rsvp/store";
import { rsvpMessages, validateRsvp } from "@/lib/rsvp/validation";

/**
 * POST /api/rsvp — public, used by the invitation form.
 *   Body: { name: string, attendance: "yes" | "no", guests: number }
 *   201 { ok: true } · 400 { errors } · 500 { error }
 *
 * GET /api/rsvp — event owner only (admin session cookie).
 *   200 { totalGuests, attendingResponses, declinedResponses, responses } · 401
 */

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: real guests never fill this hidden field.
  if (body.website) return Response.json({ ok: true }, { status: 201 });

  const result = validateRsvp({ name: body.name, attendance: body.attendance, guests: body.guests });
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 400 });

  const saved = await saveRsvp(result.data);
  if (!saved.ok) return Response.json({ error: rsvpMessages.saveFailed }, { status: 500 });

  return Response.json({ ok: true }, { status: 201 });
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const responses = await listRsvps();
  return Response.json({ ...summarize(responses), responses });
}
