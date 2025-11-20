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
    const partId = searchParams.get("p");

    if (!campaignId || !email || !partId) {
      return new Response("Missing parameters", { status: 400 });
    }

    // Track the click
    await supabase.from("email_tracking").insert([
      {
        campaign_id: campaignId,
        customer_email: email,
        event_type: "click",
        part_id: partId,
      },
    ]);

    // Redirect to the product page
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return Response.redirect(`${baseUrl}/catalog/${partId}`);
  } catch (error) {
    console.error("Track click error:", error);
    return new Response("Error", { status: 500 });
  }
}
