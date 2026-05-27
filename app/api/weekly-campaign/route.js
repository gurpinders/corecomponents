import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function GET(request) {
  // Security check — only allow requests with the correct secret key
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the latest draft campaign
  const { data: campaign } = await supabase
    .from("email_campaigns")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!campaign) {
    return NextResponse.json({
      message: "No draft campaign found — nothing sent",
    });
  }

  // Get featured parts from email_campaign_parts table
  const { data: campaignParts } = await supabase
    .from("email_campaign_parts")
    .select("part_id")
    .eq("campaign_id", campaign.id);

  const partIds = campaignParts?.map((p) => p.part_id) || [];

  // Trigger the send
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ccomponents.ca";
  const response = await fetch(`${baseUrl}/api/send-campaign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId: campaign.id,
      subject: campaign.subject,
      promoMessage: campaign.headline,
      partIds: partIds,
      truckIds: [],
    }),
  });

  const result = await response.json();
  return NextResponse.json(result);
}
