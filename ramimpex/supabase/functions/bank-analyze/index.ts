// 🤖 RAM IMPEX — ბანკის შედარების AI ანალიზი (Claude / Anthropic)
// Supabase Edge Function. გასაღები ინახება სერვერზე (საიტში არ ჩანს).
//
// განთავსება (ერთხელ, Supabase CLI-ით):
//   supabase functions deploy bank-analyze --no-verify-jwt
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx
//   (სურვ.) supabase secrets set ANTHROPIC_MODEL=claude-sonnet-5-5
//
// საიტი იძახებს: sb.functions.invoke('bank-analyze', { body: { payload } })

const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-sonnet-5-5";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    if (!ANTHROPIC_KEY) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY არ არის დაყენებული (supabase secrets set ANTHROPIC_API_KEY=...)" }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
    }
    const body = await req.json().catch(() => ({}));
    const payload = body?.payload ?? body ?? {};

    const sys =
      "შენ ხარ RAM IMPEX-ის ფინანსური ანალიტიკოსი. გაძლევენ ბანკის ამონაწერსა და პროგრამის ჩანაწერებს შორის შედარების მონაცემებს (JSON). " +
      "დაწერე მოკლე, პრაქტიკული ანალიზი ქართულად: 1) რა ჯდება და რა არა (შემოსავალი/გასავალი სხვაობები), " +
      "2) საეჭვო ან დუბლირებული ჩანაწერები, 3) ბანკში რა ჩანს პროგრამის გარეშე (დასამატებელი) და პირიქით, " +
      "4) კონკრეტული რეკომენდაციები რა შეამოწმოს/დაამატოს. მოკლედ, ბულეტებით. ნუ მოიგონებ ციფრებს — მხოლოდ მოცემულ მონაცემებზე დაყრდნობით.";

    const user = "შედარების მონაცემები (JSON):\n" + JSON.stringify(payload).slice(0, 120000);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1800,
        system: sys,
        messages: [{ role: "user", content: user }],
      }),
    });

    const j = await r.json();
    if (!r.ok) {
      return new Response(JSON.stringify({ error: (j?.error?.message || JSON.stringify(j)) }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
    }
    const text = (j?.content?.[0]?.text) || "(ცარიელი პასუხი)";
    return new Response(JSON.stringify({ text }), { headers: { ...cors, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message || e) }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
  }
});
