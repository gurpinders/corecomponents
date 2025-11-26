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
      console.error("Missing parameters:", { campaignId, email });
      // Still return pixel even on error
      return returnTrackingPixel();
    }

    // Check if this email/campaign combo already has an open event
    const { data: existing, error: selectError } = await supabase
      .from("email_tracking")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("customer_email", email)
      .eq("event_type", "open")
      .maybeSingle(); // Use maybeSingle instead of single to avoid error when no record exists

    if (selectError) {
      console.error("Select error:", selectError);
    }

    // Only track the first open (avoid counting multiple opens)
    if (!existing) {
      const { error: insertError } = await supabase
        .from("email_tracking")
        .insert([
          {
            campaign_id: campaignId,
            customer_email: email,
            event_type: "open",
          },
        ]);

      if (insertError) {
        console.error("Insert error:", insertError);
      } else {
        console.log("Open tracked:", { campaignId, email });
      }
    } else {
      console.log("Open already tracked:", { campaignId, email });
    }

    return returnTrackingPixel();
  } catch (error) {
    console.error("Track open error:", error);
    return returnTrackingPixel(); // Always return pixel even on error
  }
}

function returnTrackingPixel() {
  // Return a 1x1 transparent GIF pixel
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new Response(pixel, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
