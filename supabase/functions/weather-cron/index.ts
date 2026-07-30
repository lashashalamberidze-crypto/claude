// ═══════════════════════════════════════════════════════════════════════
// weather-cron — დღიური ამინდის რისკის SMS ავტომატური გაგზავნა
// გამომწერი: wsms_config (enabled=true). ლოკაცია: მომხმარებლის აქტიური პლანტაცია.
// ამინდი: Open-Meteo. SMS: smsoffice (SMS_API_KEY) ან PHP proxy (SMS_PROXY_URL).
// გაშვება: cron (pg_cron/pg_net ან გარე cron), x-cron-secret თავსართით.
// ═══════════════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEO_MON = ["იან","თებ","მარ","აპრ","მაი","ივნ","ივლ","აგვ","სექ","ოქტ","ნოე","დეკ"];
function geoDayMonth(d: Date){ return d.getUTCDate() + " " + GEO_MON[d.getUTCMonth()]; }

const REGION_CAP: Record<string,{lat:number,lon:number}> = {
  "კახეთი":{lat:41.9200,lon:45.4737},"თბილისი":{lat:41.6941,lon:44.8337},
  "შიდა ქართლი":{lat:41.9875,lon:44.1098},"ქვემო ქართლი":{lat:41.4760,lon:44.7928},
  "სამცხე-ჯავახეთი":{lat:41.6396,lon:42.9829},"აჭარა":{lat:41.6468,lon:41.6367},
  "გურია":{lat:41.9312,lon:42.0107},"სამეგრელო-ზემო სვანეთი":{lat:42.5092,lon:41.8709},
  "რაჭა-ლეჩხუმი და ქვემო სვანეთი":{lat:42.5237,lon:43.1501},
  "მცხეთა-მთიანეთი":{lat:41.8449,lon:44.7206},"იმერეთი":{lat:42.2679,lon:42.6880},
};

function coordsFromPlantation(pl: any){
  if(!pl) return null;
  const mc = pl.map_coords;
  if(Array.isArray(mc) && mc.length>=3 && Array.isArray(mc[0])){
    const lat = mc.reduce((s:number,p:any)=>s+Number(p[0]),0)/mc.length;
    const lon = mc.reduce((s:number,p:any)=>s+Number(p[1]),0)/mc.length;
    return { lat, lon, name: pl.name||"პლანტაცია" };
  }
  if(Array.isArray(pl.map_center) && pl.map_center.length>=2){
    return { lat:Number(pl.map_center[0]), lon:Number(pl.map_center[1]), name: pl.name||"პლანტაცია" };
  }
  if(pl.munic || pl.region){
    const cap = REGION_CAP[pl.region];
    if(cap) return { lat:cap.lat, lon:cap.lon, name:(pl.munic||pl.region)+(pl.name?" — "+pl.name:"") };
  }
  return null; // ლოკაცია უცნობია — გამოვტოვოთ (არასწორ ლოკაციაზე SMS-ს არ ვაგზავნით)
}

async function fetchForecast(lat: number, lon: number){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,dew_point_2m`
    + `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,precipitation_probability_max,et0_fao_evapotranspiration`
    + `&timezone=Asia%2FTbilisi&forecast_days=7`;
  const r = await fetch(url);
  if(!r.ok) throw new Error("open-meteo "+r.status);
  return await r.json();
}

// ── awAgriAlerts — index.html-ის იდენტური რისკის ლოგიკა ──
function awAgriAlerts(daily: any, hourly: any){
  const alerts: any[] = [];
  (daily.temperature_2m_max||[]).forEach((tmax: number, i: number)=>{
    const tmin = daily.temperature_2m_min[i];
    const precip = daily.precipitation_sum[i];
    const wind = daily.wind_speed_10m_max[i];
    const et0 = (daily.et0_fao_evapotranspiration||[])[i] || 0;
    const rainProb = (daily.precipitation_probability_max||[])[i] || 0;
    const date = new Date(daily.time[i]);
    const dname = geoDayMonth(date);

    if(tmin <= 2) alerts.push({ level: tmin<=0?"danger":"warning", icon:"🥶", title:"ყინვის საფრთხე",
      desc:`${dname} — მინ. ტემპ. ${tmin}°C. ნაყოფი და ყვავილობა შეიძლება დაზიანდეს.` });
    if(tmax >= 32) alerts.push({ level: tmax>=38?"danger":"warning", icon:"🔥", title:"სიცხის სტრესი",
      desc:`${dname} — მაქს. ტემპ. ${tmax}°C. ${tmax>=38?"კრიტიკული სიცხე.":"ნაყოფი შეიძლება დაიწვას."}` });
    if(et0 > 5 && precip < 1 && rainProb < 20) alerts.push({ level:"warning", icon:"🏜️", title:"გვალვის საფრთხე",
      desc:`${dname} — ორთქლაგვაპი ${et0.toFixed(1)}მმ, ნალექი ≈0.` });

    const hb = i*24;
    const hourRH = (hourly.relative_humidity_2m||[]).slice(hb, hb+24);
    const avgRH = hourRH.length ? hourRH.reduce((a:number,b:number)=>a+b,0)/hourRH.length : 0;
    if(avgRH >= 80 && tmax >= 15 && tmax <= 28 && precip > 3) alerts.push({ level:"warning", icon:"🍄", title:"სოკოვანი დაავადების რისკი",
      desc:`${dname} — ტენიანობა ${avgRH.toFixed(0)}%, ტემპ. ${tmin}–${tmax}°C, ნალექი ${precip.toFixed(1)}მმ.` });

    const wmo = daily.weather_code[i];
    if([96,99].includes(wmo)) alerts.push({ level:"danger", icon:"🌨️", title:"სეტყვის საფრთხე",
      desc:`${dname} — სეტყვა (კოდი ${wmo}). ნაყოფი და ფოთოლი მძიმედ დაზიანდება.` });
    if(precip > 10 && ![96,99].includes(wmo)) alerts.push({ level:"warning", icon:"🌧️", title:"ძლიერი წვიმა",
      desc:`${dname} — ${precip.toFixed(1)}მმ. შეწამლული პრეპარატი ჩამოიბანება.` });
    if(wind > 25) alerts.push({ level:"danger", icon:"💨", title:"ძლიერი ქარი",
      desc:`${dname} — ქარი ${wind.toFixed(0)}კმ/სთ. შეწამვლა მიზანშეუწონელია.` });
  });

  if(!alerts.length) alerts.push({ level:"ok", icon:"✅", title:"კრიტიკული გაფრთხილება არ არის",
    desc:"7 დღეში კრიტიკული ამინდის მოვლენა არ იგეგმება." });
  return alerts;
}

function normalizePhone(p: string){
  let s = String(p||"").replace(/\D+/g,"");
  if(s.startsWith("995")) return s;
  if(s.startsWith("5") && s.length===9) return "995"+s;
  if(s.length===9) return "995"+s;
  return s;
}

async function sendSms(to: string, text: string, SENDER: string){
  const num = normalizePhone(to);
  if(num.length < 11) throw new Error("არავალიდური ნომერი: "+to);
  const key = Deno.env.get("SMS_API_KEY");
  if(key){
    // პირდაპირ smsoffice.ge API
    const url = `https://smsoffice.ge/api/v2/send/?key=${encodeURIComponent(key)}&destination=${encodeURIComponent(num)}&sender=${encodeURIComponent(SENDER)}&content=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    const j = await r.json().catch(()=>({}));
    if(j && j.Success === false) throw new Error(j.Message || "sms api error");
    return;
  }
  // fallback: PHP proxy
  const proxy = Deno.env.get("SMS_PROXY_URL") || "https://agrointechsol.ge/sms-proxy.php";
  const body = new URLSearchParams({ to:num, text, sender:SENDER });
  const r = await fetch(proxy, { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: body.toString() });
  const j = await r.json().catch(()=>({}));
  if(!j || j.Success !== true) throw new Error((j&&j.Message) || "proxy sms error");
}

function json(data: unknown, status = 200){
  return new Response(JSON.stringify(data), { status, headers:{ "Content-Type":"application/json" } });
}

serve(async (req) => {
  // cron-secret დაცვა (მხოლოდ დამგეგმავს შეუძლია გამოძახება)
  const secret = Deno.env.get("CRON_SECRET");
  if(secret){
    const provided = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret") || "";
    if(provided !== secret) return json({ error:"unauthorized" }, 401);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!SUPABASE_URL || !SERVICE) return json({ error:"missing supabase env" }, 500);
  const SENDER = Deno.env.get("SMS_SENDER") || "agroits";
  const admin = createClient(SUPABASE_URL, SERVICE);

  const today = new Date().toISOString().slice(0,10);
  let usersChecked = 0, smsSent = 0, smsFailed = 0, skipped = 0;
  const details: any[] = [];

  try {
    const { data: cfgs, error } = await admin.from("wsms_config").select("*").eq("enabled", true);
    if(error) return json({ error: error.message }, 500);

    for(const cfg of (cfgs||[])){
      usersChecked++;
      const phonesRaw = Array.isArray(cfg.phones) ? cfg.phones : [];
      const phones = phonesRaw.map((p: any)=> typeof p==="string" ? p : (p && p.phone) || "").filter(Boolean);
      if(!phones.length){ skipped++; continue; }

      // აქტიური პლანტაცია
      let pl: any = null;
      try {
        const u = await admin.from("users").select("active_plantation_id").eq("id", cfg.user_id).maybeSingle();
        const plId = u.data?.active_plantation_id;
        if(plId){ const r = await admin.from("plantations").select("*").eq("id", plId).maybeSingle(); pl = r.data; }
        if(!pl){ const r = await admin.from("plantations").select("*").eq("user_id", cfg.user_id).limit(1); pl = (r.data||[])[0]; }
      } catch(_e){}
      const loc = coordsFromPlantation(pl);
      if(!loc){ skipped++; details.push({ user: cfg.user_id, skip:"no-location" }); continue; }

      // პროგნოზი + რისკები
      let alerts: any[] = [];
      try { const d = await fetchForecast(loc.lat, loc.lon); alerts = awAgriAlerts(d.daily, d.hourly); }
      catch(_e){ skipped++; details.push({ user: cfg.user_id, skip:"forecast-fail" }); continue; }

      const filtered = alerts.filter(a => cfg.severity==="danger" ? a.level==="danger" : (a.level==="danger"||a.level==="warning"));
      if(!filtered.length){ skipped++; continue; }

      // rate-limit — დღეში ერთხელ თითო რისკზე (sent_log ღრუბელში)
      const sentLog = (cfg.sent_log && typeof cfg.sent_log==="object") ? cfg.sent_log : {};
      const toSend = filtered.filter(a => {
        const key = today + "|" + a.level + "|" + (a.title||"").slice(0,40);
        return !sentLog[key];
      });
      if(!toSend.length){ skipped++; continue; }

      // ტექსტი
      let body = "AgroInTechSol ⚠️\n" + today + " | " + loc.name + "\n";
      for(let ai=0; ai<toSend.length; ai++){
        let ln = (toSend[ai].icon||"⚠️") + " " + (toSend[ai].title||"") + "\n" + (toSend[ai].desc||"") + "\n";
        if(ai===0 && (body+ln+"agrointechsol.ge").length > 420){
          const room = 420 - (body+"agrointechsol.ge").length - 2;
          ln = (toSend[ai].icon||"⚠️") + " " + (toSend[ai].title||"").slice(0, Math.max(0,room)) + "\n";
        } else if((body+ln+"agrointechsol.ge").length > 420){ break; }
        body += ln;
      }
      body += "agrointechsol.ge";

      // გაგზავნა
      let anyOk = false;
      for(const ph of phones){
        try { await sendSms(ph, body, SENDER); smsSent++; anyOk = true; }
        catch(e){ smsFailed++; details.push({ user: cfg.user_id, phone: ph, error: (e as Error).message }); }
      }
      if(anyOk){
        toSend.forEach(a => { sentLog[today + "|" + a.level + "|" + (a.title||"").slice(0,40)] = Date.now(); });
        try { await admin.from("wsms_config").update({ sent_log: sentLog }).eq("user_id", cfg.user_id); } catch(_e){}
      }
    }

    return json({ success:true, date:today, usersChecked, smsSent, smsFailed, skipped, details });
  } catch(err){
    return json({ error: err instanceof Error ? err.message : "unexpected", usersChecked, smsSent, smsFailed }, 500);
  }
});
