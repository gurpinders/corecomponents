import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { campaignId } = await request.json();

    // Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError) {
      return Response.json({ error: campaignError.message }, { status: 400 });
    }

    // Fetch campaign products
    const { data: campaignParts, error: partsError } = await supabase
      .from("email_campaign_parts")
      .select("*, parts(*)")
      .eq("campaign_id", campaignId)
      .order("display_order");

    if (partsError) {
      return Response.json({ error: partsError.message }, { status: 400 });
    }

    // Fetch subscribed customers
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("email, name")
      .eq("subscribed", true);

    if (customersError) {
      return Response.json({ error: customersError.message }, { status: 400 });
    }

    if (customers.length === 0) {
      return Response.json(
        { error: "No subscribed customers found" },
        { status: 400 }
      );
    }

    // Create email HTML
    const emailHtml = createEmailTemplate(campaign, campaignParts);

    // Send emails to all subscribed customers
    const emailPromises = customers.map((customer) =>
      resend.emails.send({
        from: "onboarding@resend.dev", // Resend's test email
        to: customer.email,
        subject: campaign.subject,
        html: emailHtml,
      })
    );

    await Promise.all(emailPromises);

    // Update campaign status
    await supabase
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipients: customers.length,
      })
      .eq("id", campaignId);

    return Response.json({
      success: true,
      message: `Campaign sent to ${customers.length} customers`,
    });
  } catch (error) {
    console.error("Send campaign error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function createEmailTemplate(campaign, campaignParts) {
  const productsHtml = campaignParts
    .map(
      (cp) => `
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            ${
              cp.parts.images && cp.parts.images[0]
                ? `
                <img src="${cp.parts.images[0]}" alt="${cp.parts.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
            `
                : ""
            }
            <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #333;">${
              cp.parts.name
            }</h3>
            ${
              cp.parts.description
                ? `<p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">${cp.parts.description}</p>`
                : ""
            }
            <p style="font-size: 20px; font-weight: bold; color: #000; margin: 0;">Starting from $${
              cp.parts.price
            }</p>
        </div>
    `
    )
    .join("");

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background-color: #000000; color: #ffffff; padding: 32px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">CoreComponents</h1>
                    ${
                      campaign.headline
                        ? `<p style="margin: 8px 0 0 0; font-size: 16px;">${campaign.headline}</p>`
                        : ""
                    }
                </div>

                <!-- Products -->
                <div style="padding: 24px;">
                    ${productsHtml}
                </div>

                <!-- Footer -->
                <div style="background-color: #f5f5f5; padding: 24px; text-align: center; color: #666; font-size: 12px;">
                    <p style="margin: 0 0 8px 0;">CoreComponents - Quality Trucking Parts</p>
                    <p style="margin: 0 0 8px 0;">(647) 993-8235 | info@ccomponents.ca</p>
                    <p style="margin: 0;">You received this email because you subscribed to our mailing list.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
