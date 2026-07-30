import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY)
      return json({ error: "Missing Supabase environment variables" }, 500);

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const body = await req.json();

    if (body.action === "notify_registration")
      return json({ success: true, message: "notify_registration accepted" });

    if (!token) return json({ error: "Missing bearer token" }, 401);

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user)
      return json({ error: "Unauthorized", details: authError?.message }, 401);

    const { data: requester, error: requesterError } = await userClient
      .from("users").select("id, email, role, approved").eq("id", user.id).single();
    if (requesterError || !requester)
      return json({ error: "Admin profile not found" }, 403);

    const ADMIN_EMAILS = ["lasha.shalamberidze@gmail.com", "intechsolltd@gmail.com"];
    const isAdmin = requester.role === "admin" || ADMIN_EMAILS.includes((requester.email || "").toLowerCase());
    if (!isAdmin) return json({ error: "Forbidden: admin only" }, 403);

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ════════ ახალი: create_user ════════
    if (body.action === "create_user") {
      const nu = body.newUser;
      if (!nu || !nu.email || !nu.password)
        return json({ error: "email და password აუცილებელია" }, 400);

      const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
        email: nu.email,
        password: nu.password,
        email_confirm: true,
        user_metadata: { name: nu.name ?? "", plan: nu.plan ?? "" },
      });
      if (createErr || !created?.user)
        return json({ error: createErr?.message || "Auth user not created" }, 400);

      const newId = created.user.id;
      const profile = {
     id: newId,
     name: nu.name ?? "",
     email: nu.email,
     plan: nu.plan ?? "full",
     role: nu.role ?? "user",
     approved: nu.approved ?? true,
   };
      const { data: profData, error: profErr } = await adminClient
        .from("users").insert(profile).select("id, name, email, role, approved").single();
      if (profErr) {
        await adminClient.auth.admin.deleteUser(newId);
        return json({ error: profErr.message, note: "Auth user rolled back" }, 400);
      }
      return json({ success: true, action: "create_user", user: profData });
    }

    if (body.action === "approve_user") {
      if (!body.userId) return json({ error: "userId is required" }, 400);
      const { data, error } = await adminClient.from("users")
        .update({ approved: true }).eq("id", body.userId)
        .select("id, name, email, approved").single();
      if (error) return json({ error: error.message }, 400);
      return json({ success: true, action: "approve_user", user: data });
    }

    if (body.action === "revoke_user") {
      if (!body.userId) return json({ error: "userId is required" }, 400);
      const { data, error } = await adminClient.from("users")
        .update({ approved: false }).eq("id", body.userId)
        .select("id, name, email, approved").single();
      if (error) return json({ error: error.message }, 400);
      return json({ success: true, action: "revoke_user", user: data });
    }

    if (body.action === "delete_user") {
      if (!body.userId) return json({ error: "userId is required" }, 400);
      if (body.userId === user.id)
        return json({ error: "ადმინს საკუთარი თავის წაშლა არ შეუძლია" }, 400);
      const { error: tblError } = await adminClient.from("users").delete().eq("id", body.userId);
      const { error: authDelError } = await adminClient.auth.admin.deleteUser(body.userId);
      const authMissing = authDelError && /not.*found|does not exist|no.*user/i.test(authDelError.message || "");
      if (authDelError && !authMissing)
        return json({ error: authDelError.message, tableDeleted: !tblError }, 400);
      return json({ success: true, action: "delete_user", userId: body.userId, tableDeleted: !tblError });
    }
    if (body.action === "list_users") {
      const { data, error } = await adminClient
        .from("users")
        .select("*");
      if (error) return json({ error: error.message }, 400);
      return json({ success: true, users: data });
    }

    // ════════ ახალი: notify_event — მეილი ყველა მომხმარებელს ღონისძიებაზე ════════
    if (body.action === "notify_event") {
      const ev = body.event || {};
      if (!ev.title) return json({ error: "ღონისძიების სათაური აუცილებელია" }, 400);

      // არსებული secret-ების გამოყენება (GMAIL_APP_PASS უკვე დაყენებულია)
      const GMAIL_USER = Deno.env.get("GMAIL_USER") || Deno.env.get("GMAIL_ADDRESS") || "intechsolltd@gmail.com";
      const GMAIL_APP_PASSWORD = (Deno.env.get("GMAIL_APP_PASS") || Deno.env.get("GMAIL_APP_PASSWORD") || "").replace(/\s+/g, "");
      const FROM_NAME = Deno.env.get("EVENT_FROM_NAME") || "AgroInTechSol";
      if (!GMAIL_APP_PASSWORD)
        return json({ error: "GMAIL_APP_PASS არ არის დაყენებული (Edge Function Secrets)" }, 500);

      // მიმღებები — ყველა რეალური მომხმარებელი (demo-ს გამოკლებით)
      const { data: users, error: uErr } = await adminClient
        .from("users").select("email, is_demo").not("email", "is", null);
      if (uErr) return json({ error: "users წაკითხვა ვერ მოხერხდა: " + uErr.message }, 500);
      const emails = Array.from(new Set(
        (users || []).filter((u: any) => u.email && !u.is_demo).map((u: any) => String(u.email).trim())
      ));
      if (!emails.length) return json({ success: true, sent: 0, failed: 0, note: "მიმღები არ მოიძებნა" });

      const esc = (s: string) => String(s || "").replace(/[&<>"]/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
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

      // Gmail SMTP-ით გაგზავნა (from = intechsolltd@gmail.com), BCC batch-ებად
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
        },
      });
      let sent = 0, failed = 0;
      const CHUNK = 40; // Gmail: ~100 მიმღები/წერილი — 40 უსაფრთხოა
      try {
        for (let i = 0; i < emails.length; i += CHUNK) {
          const batch = emails.slice(i, i + CHUNK);
          try {
            await client.send({
              from: `${FROM_NAME} <${GMAIL_USER}>`,
              to: GMAIL_USER,
              bcc: batch,
              subject,
              content: (ev.title || "") + " — " + (when || ""),
              html,
            });
            sent += batch.length;
          } catch (_e) { failed += batch.length; }
        }
      } finally {
        try { await client.close(); } catch (_e) { /* ignore */ }
      }
      return json({ success: true, action: "notify_event", sent, failed, total: emails.length });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
