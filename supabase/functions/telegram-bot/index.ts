// ═══════════════════════════════════════════════════════════════════════
// telegram-bot — Telegram webhook: მკრეფავების დაკავშირება (chat_id შენახვა)
//
// ნაკადი:
//   1) მკრეფავი ხსნის t.me/<bot>?start=<owner_user_id> → აჭერს Start
//   2) ბოტი ინახავს pending (chat_id → owner) და სთხოვს ნომრის გაზიარებას
//   3) მკრეფავი აზიარებს კონტაქტს → ვინახავთ telegram_links (owner, phone, chat_id)
//
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET,
//          SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Webhook: https://api.telegram.org/bot<TOKEN>/setWebhook?url=<fn-url>&secret_token=<SECRET>
// ═══════════════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";

function normalizePhone(p: string){
  let s = String(p||"").replace(/\D+/g,"");
  if(s.startsWith("995")) return s;
  if(s.length===9 && s.startsWith("5")) return "995"+s;
  if(s.length===9) return "995"+s;
  return s;
}
function isUuid(s: string){ return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s); }
async function tg(method: string, body: unknown){
  return fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body)
  });
}
const ok = () => new Response("ok", { status: 200 });

serve(async (req) => {
  // Telegram-ის secret token header
  const secret = Deno.env.get("TELEGRAM_WEBHOOK_SECRET");
  if(secret){
    const got = req.headers.get("x-telegram-bot-api-secret-token") || "";
    if(got !== secret) return new Response("unauthorized", { status: 401 });
  }
  if(!TOKEN) return new Response("no token", { status: 500 });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE);

  let upd: any = {};
  try { upd = await req.json(); } catch(_e){ return ok(); }
  const msg = upd.message || upd.edited_message;
  if(!msg || !msg.chat) return ok();
  const chatId = msg.chat.id;

  try {
    // ── /start <owner_user_id> ──
    if(typeof msg.text === "string" && msg.text.startsWith("/start")){
      const param = (msg.text.split(/\s+/)[1] || "").trim();
      if(param && isUuid(param)){
        await admin.from("telegram_pending").upsert({ chat_id: chatId, owner_token: param, at: new Date().toISOString() });
      }
      await tg("sendMessage", {
        chat_id: chatId,
        text: "👋 გამარჯობა! AgroInTechSol-ის შეტყობინებების მისაღებად გააზიარე შენი ტელეფონის ნომერი ღილაკით 👇",
        reply_markup: {
          keyboard: [[{ text: "📱 ნომრის გაზიარება", request_contact: true }]],
          resize_keyboard: true, one_time_keyboard: true
        }
      });
      return ok();
    }

    // ── კონტაქტის გაზიარება ──
    if(msg.contact && msg.contact.phone_number){
      const phone = normalizePhone(msg.contact.phone_number);
      const pend = await admin.from("telegram_pending").select("owner_token").eq("chat_id", chatId).maybeSingle();
      const owner = pend.data?.owner_token;
      if(owner && isUuid(owner) && phone.length >= 11){
        const nm = [msg.contact.first_name, msg.contact.last_name].filter(Boolean).join(" ");
        await admin.from("telegram_links").upsert(
          { user_id: owner, phone, chat_id: chatId, name: nm, linked_at: new Date().toISOString() },
          { onConflict: "user_id,phone" }
        );
        await admin.from("telegram_pending").delete().eq("chat_id", chatId);
        await tg("sendMessage", {
          chat_id: chatId,
          text: "✅ მზადაა! ამიერიდან შეტყობინებები (აწონვა, დღის ჯამი, ამინდი) უფასოდ აქ, Telegram-ზე მოგივა.",
          reply_markup: { remove_keyboard: true }
        });
      } else {
        await tg("sendMessage", {
          chat_id: chatId,
          text: "⚠️ დაკავშირება ვერ მოხერხდა. სცადე ხელახლა მენეჯერის მიერ მოცემული ბმულით (t.me/…?start=…)."
        });
      }
      return ok();
    }

    // სხვა შემთხვევა — მინი დახმარება
    if(typeof msg.text === "string"){
      await tg("sendMessage", {
        chat_id: chatId,
        text: "დასაკავშირებლად გახსენი მენეჯერის ბმული (t.me/…?start=…) და დააჭირე Start."
      });
    }
  } catch(e){
    // ჩუმად — Telegram თავიდან არ გამოგვიგზავნის თუ 200 დავაბრუნეთ
    console.error("telegram-bot", (e as Error).message);
  }
  return ok();
});
