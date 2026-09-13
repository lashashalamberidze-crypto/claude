// ═══════════════════════════════════════════════════════════════════════
// telegram-send — შეტყობინების გაგზავნა მკრეფავებზე Telegram-ით
//   აპი უძახებს (მომხმარებლის JWT-ით). ვგზავნით მხოლოდ ამ მფლობელის
//   დაკავშირებულ (telegram_links) მკრეფავებზე.
//
//   body:
//     { "text": "..." }                      → broadcast ყველა დაკავშირებულზე (ტესტი)
//     { "text": "...", "phones": ["5..."] }  → მხოლოდ ამ ნომრებზე
//     { "daily": true }                      → დღის ჯამი თითო მკრეფავს (პრიორიტეტი)
//
// Secrets: TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_ANON_KEY,
//          SUPABASE_SERVICE_ROLE_KEY  (ბოლო სამი ავტომატურია)
// ⚠️ Deploy: „Verify JWT" ჩართული დატოვე (მომხმარებელი უნდა გავიგოთ).
// ═══════════════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(data: unknown, status = 200){
  return new Response(JSON.stringify(data), { status, headers:{ ...CORS, "Content-Type":"application/json" } });
}
function norm(p: string){ let s=String(p||"").replace(/\D+/g,""); if(s.startsWith("995")) return s; if(s.length===9) return "995"+s; return s; }
async function tgSend(chatId: number, text: string){
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  const j = await r.json().catch(()=>({}));
  return !!j.ok;
}

serve(async (req) => {
  if(req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if(!TOKEN) return json({ error:"TELEGRAM_BOT_TOKEN აკლია" }, 500);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const auth = req.headers.get("Authorization") || "";

  // ვინ არის მომხმარებელი (JWT-დან)
  const userClient = createClient(SUPABASE_URL, ANON, { global:{ headers:{ Authorization: auth } } });
  const { data: uData } = await userClient.auth.getUser();
  const user = uData?.user;
  if(!user) return json({ error:"unauthorized" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE);
  let body: any = {};
  try { body = await req.json(); } catch(_e){}

  // დაკავშირებული ჩატები (ამ მფლობელისთვის)
  const linksRes = await admin.from("telegram_links").select("phone,chat_id,name").eq("user_id", user.id);
  const byPhone: Record<string,{chat_id:number,name:string}> = {};
  (linksRes.data||[]).forEach((l:any)=>{ byPhone[norm(l.phone)] = { chat_id: l.chat_id, name: l.name||"" }; });

  let sent = 0, failed = 0;
  const details: any[] = [];

  // ── QR სურათები: [{phone, b64, caption}] → sendPhoto თითო დაკავშირებულს ──
  if(Array.isArray(body.qr) && body.qr.length){
    for(const item of body.qr){
      const ph = norm(item?.phone || "");
      const link = byPhone[ph];
      if(!link){ continue; }                       // მხოლოდ დაკავშირებულებს
      const b64 = String(item?.b64 || "").replace(/^data:image\/\w+;base64,/, "");
      if(!b64){ failed++; continue; }
      try{
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
        const form = new FormData();
        form.append("chat_id", String(link.chat_id));
        if(item.caption) form.append("caption", String(item.caption));
        form.append("photo", new Blob([bytes], { type:"image/png" }), "qr.png");
        const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method:"POST", body: form });
        const j = await r.json().catch(()=>({}));
        if(j.ok) sent++; else failed++;
      }catch(_e){ failed++; }
    }
    return json({ ok:true, mode:"qr", linked:Object.keys(byPhone).length, sent, failed });
  }

  if(body.daily){
    // დღის ჯამი — harvest_sessions აგრეგაცია picker_id-ით, ტელეფონი krepa_pickers-იდან
    const today = (typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date))
      ? body.date : new Date().toISOString().slice(0,10);

    // მკრეფავები: uid → phone, name → phone (სარეზერვო)
    const pkRes = await admin.from("krepa_pickers").select("uid,phone,name").eq("user_id", user.id);
    const uidPhone: Record<string,string> = {};
    const namePhone: Record<string,string> = {};
    (pkRes.data||[]).forEach((p:any)=>{
      const ph = norm(p.phone||"");
      if(p.uid && ph) uidPhone[String(p.uid)] = ph;
      const nm = (p.name || "").trim();
      if(nm && ph) namePhone[nm] = ph;
    });

    let rows: any[] = [];
    for(let from=0; from<40000; from+=1000){
      const r = await admin.from("harvest_sessions").select("picker_id,picker_name,weight,earned,date")
        .eq("user_id", user.id).eq("date", today).range(from, from+999);
      if(r.error) break;
      rows = rows.concat(r.data||[]);
      if((r.data||[]).length < 1000) break;
    }
    // აგრეგაცია ტელეფონზე (uid → phone, ან სახელით)
    const agg: Record<string,{name:string,box:number,kg:number,earn:number}> = {};
    rows.forEach((s:any)=>{
      const ph = uidPhone[String(s.picker_id||"")] || namePhone[(s.picker_name||"").trim()] || "";
      if(!ph) return;
      if(!agg[ph]) agg[ph]={ name:s.picker_name||"", box:0, kg:0, earn:0 };
      agg[ph].box++; agg[ph].kg+=(+s.weight||0); agg[ph].earn+=(+s.earned||0);
    });
    for(const ph of Object.keys(agg)){
      const link = byPhone[ph]; if(!link) continue;   // მხოლოდ დაკავშირებულებს
      const a = agg[ph];
      const text = `📊 დღის ჯამი — ${today}\n${a.name}\n🧺 ყუთი: ${a.box}\n⚖️ კგ: ${a.kg.toFixed(1)}\n💰 ჯამი: ${a.earn.toFixed(2)} ₾\n\nAgroInTechSol`;
      if(await tgSend(link.chat_id, text)) sent++; else failed++;
    }
    return json({ ok:true, mode:"daily", date:today, linked:Object.keys(byPhone).length, matched:Object.keys(agg).length, sent, failed });
  }

  // text broadcast / targeted
  const text = String(body.text||"").trim();
  if(!text) return json({ error:"text ან daily საჭიროა" }, 400);
  const targets = Array.isArray(body.phones) && body.phones.length
    ? body.phones.map(norm).filter((p:string)=>byPhone[p])
    : Object.keys(byPhone);
  for(const ph of targets){
    if(await tgSend(byPhone[ph].chat_id, text)) sent++; else failed++;
  }
  return json({ ok:true, mode:"text", linked:Object.keys(byPhone).length, sent, failed, details });
});
