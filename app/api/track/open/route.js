import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("c");
    const email = searchParams.get("e");

    if (!campaignId || !email) {
      return new Response("Missing parameters", { status: 400 });
    }

    // Check if this email/campaign combo already has an open event
    const { data: existing } = await supabase
      .from("email_tracking")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("customer_email", email)
      .eq("event_type", "open")
      .single();

    // Only track the first open (avoid counting multiple opens)
    if (!existing) {
      await supabase.from("email_tracking").insert([
        {
          campaign_id: campaignId,
          customer_email: email,
          event_type: "open",
        },
      ]);
    }

    // Return a 1x1 transparent pixel
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );

    return new Response(pixel, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Track open error:", error);
    return new Response("Error", { status: 500 });
  }
}
