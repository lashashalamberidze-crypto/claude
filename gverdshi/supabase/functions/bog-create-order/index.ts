// ============================================================================
// bog-create-order — ქმნის BOG (საქართველოს ბანკი) გადახდის ორდერს
//
// ⚠️ ეს კოდი ცოცხლად არ არის დატესტილი. deploy-მდე გადაამოწმე ველების სახელები
//    BOG-ის აქტუალურ დოკუმენტაციასთან (api.bog.ge) და გაუშვი BOG-ის ტესტ-გარემოში.
//
// Deploy:  supabase functions deploy bog-create-order --no-verify-jwt
// Secrets: supabase secrets set BOG_CLIENT_ID=... BOG_CLIENT_SECRET=... PUBLIC_SITE_URL=https://gverdshi.ge
//   (SUPABASE_URL და SUPABASE_SERVICE_ROLE_KEY ავტომატურად ხელმისაწვდომია)
// ============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const { amount, description, booking_id, customer_phone } = await req.json();
    const amt = Number(amount);
    if (!amt || amt <= 0) return json({ error: "invalid amount" }, 400);

    const CLIENT_ID = Deno.env.get("BOG_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("BOG_CLIENT_SECRET");
    const PUBLIC_URL = Deno.env.get("PUBLIC_SITE_URL") ?? "https://gverdshi.ge";
    const FUNC_BASE = (Deno.env.get("SUPABASE_URL") ?? "") + "/functions/v1";
    if (!CLIENT_ID || !CLIENT_SECRET) return json({ error: "BOG credentials not set" }, 500);

    // 1) OAuth token (client_credentials)
    const tokenRes = await fetch(
      "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        },
        body: "grant_type=client_credentials",
      },
    );
    if (!tokenRes.ok) return json({ error: "auth failed", detail: await tokenRes.text() }, 502);
    const { access_token } = await tokenRes.json();

    // 2) create ecommerce order
    const externalId = booking_id ?? crypto.randomUUID();
    const orderRes = await fetch("https://api.bog.ge/payments/v1/ecommerce/orders", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
        "Accept-Language": "ka",
      },
      body: JSON.stringify({
        callback_url: FUNC_BASE + "/bog-callback",
        external_order_id: externalId,
        purchase_units: {
          currency: "GEL",
          total_amount: amt,
          basket: [{
            quantity: 1,
            unit_price: amt,
            product_id: "gverdshi-service",
            name: description ?? "gverdshi.ge",
          }],
        },
        redirect_urls: {
          success: PUBLIC_URL + "/?paid=1",
          fail: PUBLIC_URL + "/?paid=0",
        },
      }),
    });
    if (!orderRes.ok) return json({ error: "order failed", detail: await orderRes.text() }, 502);
    const order = await orderRes.json();
    const redirect = order?._links?.redirect?.href ?? order?.links?.redirect?.href;

    // 3) ჩავიწეროთ payment intent (service role — RLS-ს ვცდებით)
    try {
      const sb = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await sb.from("payments").insert([{
        order_id: order.id,
        external_order_id: externalId,
        booking_id: booking_id ?? null,
        amount: amt,
        currency: "GEL",
        customer_phone: customer_phone ?? null,
        status: "pending",
      }]);
    } catch (_e) { /* payments table optional */ }

    return json({ order_id: order.id, redirect });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
