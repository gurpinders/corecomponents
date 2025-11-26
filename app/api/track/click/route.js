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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!campaignId || !email || !partId) {
      console.error("Missing parameters:", { campaignId, email, partId });
      // Still redirect even if tracking fails
      return Response.redirect(`${baseUrl}/catalog/${partId}`);
    }

    // Track the click (track every click, not just unique)
    const { error: insertError } = await supabase
      .from("email_tracking")
      .insert([
        {
          campaign_id: campaignId,
          customer_email: email,
          event_type: "click",
          part_id: partId,
        },
      ]);

    if (insertError) {
      console.error("Click tracking error:", insertError);
    } else {
      console.log("Click tracked:", { campaignId, email, partId });
    }

    // Always redirect to the product page
    return Response.redirect(`${baseUrl}/catalog/${partId}`);
  } catch (error) {
    console.error("Track click error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return Response.redirect(`${baseUrl}/catalog`);
  }
}
