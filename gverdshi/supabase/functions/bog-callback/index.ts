// ============================================================================
// bog-callback — იღებს BOG-ის გადახდის callback-ს და ანახლებს გადახდის სტატუსს
//
// ⚠️ ცოცხლად არ არის დატესტილი. deploy-მდე გადაამოწმე BOG-ის დოკუმენტაცია.
// 🔐 პროდაქშენში აუცილებელია ხელმოწერის (Callback-Signature) ვერიფიკაცია
//    BOG-ის public key-ით — ქვემოთ მონიშნულია სად.
//
// Deploy:  supabase functions deploy bog-callback --no-verify-jwt
//   (--no-verify-jwt სავალდებულოა — callback-ს BOG აგზავნის, არა მომხმარებელი)
// ============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });

  try {
    const raw = await req.text();

    // 🔐 TODO (production): ხელმოწერის ვერიფიკაცია
    // const signature = req.headers.get("Callback-Signature");
    // verifyWithBogPublicKey(raw, signature)  // BOG-ის public key-ით
    // თუ არ დამთხვა → return new Response("bad signature", { status: 401 });

    const payload = JSON.parse(raw);
    const body = payload.body ?? payload;
    const orderId = body.order_id ?? body.id;
    const externalId = body.external_order_id;
    // BOG სტატუსი: მაგ. order_status.key = "completed" | "rejected" | "refunded"
    const statusKey = body?.order_status?.key ?? body?.status;
    const paid = statusKey === "completed" || statusKey === "success";

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ვანახლებთ payment ჩანაწერს
    await sb.from("payments")
      .update({ status: paid ? "paid" : "failed", raw_status: statusKey, paid_at: paid ? new Date().toISOString() : null })
      .eq("order_id", orderId);

    // ვანახლებთ ჯავშნის სტატუსსაც (თუ დაკავშირებულია)
    if (paid && externalId) {
      await sb.from("bookings").update({ status: "confirmed" }).eq("id", externalId);
    }

    // BOG ელოდება 200-ს
    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("bog-callback error:", e);
    return new Response("error", { status: 500 });
  }
});
