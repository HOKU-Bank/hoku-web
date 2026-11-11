import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase";

// Called daily by a Vercel cron (vercel.json). A tiny query keeps the free
// Supabase project from being paused after a week without traffic, which would
// silently break the contact form. Reads are denied by RLS, so it returns no rows.
export async function GET() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests?select=id&limit=1`, {
    headers: { apikey: SUPABASE_KEY },
    cache: "no-store",
  });
  return Response.json({ ok: res.ok, status: res.status });
}
