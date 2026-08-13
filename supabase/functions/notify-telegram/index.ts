// Supabase Edge Function — Telegram-ზე ადმინის შეტყობინება
// Deploy:  supabase functions deploy notify-telegram
// Secrets: supabase secrets set TELEGRAM_BOT_TOKEN=xxxx TELEGRAM_CHAT_ID=yyyy
//
// ბოტის ტოკენი აქ არ იწერება — ინახება Supabase secret-ებში (უსაფრთხოდ).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { message } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ success: false, error: "no message" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!token || !chatId) {
      return new Response(JSON.stringify({ success: false, error: "missing TELEGRAM secrets" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // chatId შეიძლება იყოს რამდენიმე (მძიმით გამოყოფილი) — ყველას ვუგზავნით
    const chatIds = String(chatId).split(",").map((s) => s.trim()).filter(Boolean);
    const results = [];
    for (const cid of chatIds) {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: cid, text: message, disable_web_page_preview: true }),
      });
      results.push(await r.json());
    }

    const ok = results.every((d) => d && d.ok === true);
    return new Response(JSON.stringify({ success: ok, results }),
      { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: String(e) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
