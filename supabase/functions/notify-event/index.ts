// ═══════════════════════════════════════════════════════════════════════
// notify-event — აგზავნის მეილს ყველა რეგისტრირებულ მომხმარებელს ღონისძიებაზე
// Supabase Edge Function (Deno).  განთავსება:
//   supabase functions deploy notify-event
// საჭირო secrets (Supabase → Project → Edge Functions → Secrets):
//   RESEND_API_KEY     — Resend-ის API გასაღები (resend.com)
//   EVENT_FROM_EMAIL   — გამგზავნი, ვერიფიცირებული დომენით,
//                        მაგ: "AgroInTechSol <info@agrointechsol.ge>"
//   ADMIN_EMAILS       — (არჩევითი) მძიმით გამოყოფილი ადმინ-მეილები;
//                        თუ დაყენებულია, გაგზავნა მხოლოდ მათ შეუძლიათ
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — ავტომატურად არსებობს
// ═══════════════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const esc = (s: string) =>
  String(s || "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND = Deno.env.get("RESEND_API_KEY");
    const FROM = Deno.env.get("EVENT_FROM_EMAIL") || "AgroInTechSol <onboarding@resend.dev>";
    const ADMINS = (Deno.env.get("ADMIN_EMAILS") || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

    if (!RESEND) return json({ error: "RESEND_API_KEY არ არის დაყენებული" }, 500);

    // ── caller-ის ავთენტიფიკაცია ──
    const authz = req.headers.get("Authorization") || "";
    const jwt = authz.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ error: "ავტორიზაცია საჭიროა" }, 401);
    const admin = createClient(SUPA_URL, SERVICE);
    const { data: udata, error: uerr } = await admin.auth.getUser(jwt);
    if (uerr || !udata?.user) return json({ error: "არავალიდური სესია" }, 401);
    const callerEmail = (udata.user.email || "").toLowerCase();
    if (ADMINS.length && !ADMINS.includes(callerEmail))
      return json({ error: "მხოლოდ ადმინს შეუძლია გაგზავნა" }, 403);

    const body = await req.json().catch(() => ({}));
    const ev = body.event || {};
    if (!ev.title) return json({ error: "ღონისძიების სათაური სავალდებულოა" }, 400);

    // ── მიმღებები: ყველა რეალური მომხმარებელი (demo-ს გამოკლებით) ──
    const { data: users, error: qerr } = await admin
      .from("users")
      .select("email, name, is_demo")
      .not("email", "is", null);
    if (qerr) return json({ error: "users-ის წაკითხვა ვერ მოხერხდა: " + qerr.message }, 500);
    const emails = Array.from(new Set(
      (users || []).filter((u: any) => u.email && !u.is_demo).map((u: any) => String(u.email).trim())
    ));
    if (!emails.length) return json({ sent: 0, failed: 0, note: "მიმღები არ მოიძებნა" });

    // ── მეილის შიგთავსი ──
    const when = esc(ev.event_date || "") +
      (ev.date_to && ev.date_to !== ev.event_date ? " – " + esc(ev.date_to) : "") +
      (ev.time ? " · " + esc(ev.time) : "");
    const subject = "📅 ახალი ღონისძიება — " + (ev.title || "");
    const html = `
      <div style="font-family:'Noto Sans Georgian',Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:linear-gradient(135deg,#18B981,#0E9E76);color:#fff;padding:22px 24px;border-radius:14px 14px 0 0">
          <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.9">AgroInTechSol · ღონისძიება</div>
          <div style="font-size:22px;font-weight:800;margin-top:6px">${esc(ev.title)}</div>
          ${ev.type ? `<div style="font-size:13px;margin-top:4px;opacity:.95">${esc(ev.type)}</div>` : ""}
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px;padding:20px 24px">
          <p style="margin:0 0 10px"><b>🗓️ თარიღი:</b> ${when || "—"}</p>
          ${ev.location ? `<p style="margin:0 0 10px"><b>📍 ადგილი:</b> ${esc(ev.location)}</p>` : ""}
          ${ev.description ? `<p style="margin:0 0 14px;line-height:1.6;color:#334155">${esc(ev.description)}</p>` : ""}
          ${ev.url ? `<p style="margin:16px 0"><a href="${esc(ev.url)}" style="background:#18B981;color:#fff;text-decoration:none;padding:11px 22px;border-radius:9px;font-weight:700;display:inline-block">დარეგისტრირდი / შესვლა</a></p>` : ""}
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:18px 0">
          <p style="font-size:12px;color:#94a3b8;margin:0">ეს შეტყობინება მიიღეთ, რადგან რეგისტრირებული ხართ agrointechsol.ge-ზე.</p>
        </div>
      </div>`;

    // ── გაგზავნა Resend-ით, BCC batch-ებად (privacy) ──
    let sent = 0, failed = 0;
    const CHUNK = 45;
    for (let i = 0; i < emails.length; i += CHUNK) {
      const batch = emails.slice(i, i + CHUNK);
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": "Bearer " + RESEND, "Content-Type": "application/json" },
          body: JSON.stringify({ from: FROM, to: [FROM.replace(/.*<|>.*/g, "") || callerEmail], bcc: batch, subject, html }),
        });
        if (r.ok) sent += batch.length; else { failed += batch.length; }
      } catch (_e) { failed += batch.length; }
    }
    return json({ sent, failed, total: emails.length });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
