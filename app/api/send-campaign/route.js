import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { generateCampaignEmail } from "@/lib/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const {
      campaignId,
      subject,
      promoMessage,
      partIds,
      truckIds = [],
      sendToAll = true,
    } = await request.json();

    // Fetch selected parts
    const { data: parts } = await supabase
      .from("parts")
      .select("*")
      .in("id", partIds);

    // Fetch selected trucks
    let trucks = [];
    if (truckIds.length > 0) {
      const { data: truckData } = await supabase
        .from("trucks")
        .select("*")
        .in("id", truckIds);
      trucks = truckData || [];
    }

    // Get all recipients
    const emailSet = new Set();

    // From customers table
    const { data: customers } = await supabase
      .from("customers")
      .select("email");
    if (customers)
      customers.forEach((c) => {
        if (c.email) emailSet.add(c.email.toLowerCase());
      });

    // From newsletter_subscribers table
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("active", true);
    if (subscribers)
      subscribers.forEach((s) => {
        if (s.email) emailSet.add(s.email.toLowerCase());
      });

    const recipients = [...emailSet];

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 },
      );
    }

    // Generate HTML
    const html = generateCampaignEmail({
      promoMessage,
      parts: parts || [],
      trucks,
    });

    // Send in batches of 50
    const batchSize = 50;
    let totalSent = 0;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      for (const email of batch) {
        await resend.emails.send({
          from: "CoreComponents <info@ccomponents.ca>",
          to: [email],
          subject: subject,
          html: html,
        });
      }

      totalSent += batch.length;
    }

    // Update campaign status in DB
    if (campaignId) {
      await supabase
        .from("email_campaigns")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          recipients: totalSent,
        })
        .eq("id", campaignId);
    }

    return NextResponse.json({ success: true, totalSent });
  } catch (error) {
    console.error("Send campaign error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
