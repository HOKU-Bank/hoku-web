import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase";

const ROLES = new Set(["investor", "partner", "press", "other"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Stores a contact request in Supabase and e-mails it to the founders.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const row = {
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    organisation: clean(body.organisation, 160) || null,
    role: ROLES.has(String(body.role)) ? String(body.role) : "other",
    message: clean(body.message, 2000) || null,
    consent: body.consent === true,
    source: "website",
  };
  if (!row.name || !EMAIL.test(row.email) || !row.consent) {
    return Response.json({ error: "Please fill in your name, a valid e-mail and the consent box." }, { status: 400 });
  }

  const saved = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!saved.ok) {
    console.error("contact: supabase insert failed", saved.status, await saved.text());
    return Response.json({ error: "Could not save your message" }, { status: 502 });
  }

  await notify(row).catch((e) => console.error("contact: e-mail failed", e));
  return Response.json({ ok: true });
}

// Sends the request by e-mail through Resend when RESEND_API_KEY and
// CONTACT_TO are set in the Vercel project; otherwise only the database keeps it.
async function notify(row: { name: string; email: string; organisation: string | null; role: string; message: string | null }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !to?.length) return;

  const from = process.env.CONTACT_FROM || "Hoku Bank website <onboarding@resend.dev>";
  const role = row.role[0].toUpperCase() + row.role.slice(1);
  const subject = `New contact: ${row.name} (${role}${row.organisation ? `, ${row.organisation}` : ""})`;
  const lines: [string, string][] = [
    ["Name", row.name],
    ["E-mail", row.email],
    ["Organisation", row.organisation ?? "-"],
    ["Reaching out as", role],
  ];
  const html = `
    <table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px">
      ${lines.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><b>${escape(v)}</b></td></tr>`).join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escape(row.message ?? "(no message)")}</p>
    <p style="font-family:system-ui,sans-serif;font-size:12px;color:#888">Reply to this e-mail to answer ${escape(row.name)} directly.</p>`;
  const text = `${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${row.message ?? "(no message)"}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: row.email, subject, html, text }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}
