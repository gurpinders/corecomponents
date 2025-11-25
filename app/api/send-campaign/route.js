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
      .select("email, name, unsubscribe_token")
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

    // Send emails to all subscribed customers
    const emailPromises = customers.map((customer) => {
      const emailHtml = createEmailTemplate(campaign, campaignParts, customer);

      return resend.emails.send({
        from: "onboarding@resend.dev",
        to: customer.email,
        subject: campaign.subject,
        html: emailHtml,
      });
    });

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

function createEmailTemplate(campaign, campaignParts, customer) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Create 2-column product grid
  const productsHtml = campaignParts
    .map((cp, index) => {
      const clickTrackingUrl = `${baseUrl}/api/track/click?c=${
        campaign.id
      }&e=${encodeURIComponent(customer.email)}&p=${cp.parts.id}`;

      const hasSale = cp.parts.retail_price > cp.parts.customer_price;
      const badge = hasSale
        ? `<span style="position: absolute; top: 12px; right: 12px; background-color: #c41e3a; color: white; padding: 6px 14px; font-size: 11px; font-weight: bold; border-radius: 4px; z-index: 10;">SALE</span>`
        : "";

      return `
        <div style="background: #ffffff; border: 2px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="position: relative; width: 100%; height: 220px; overflow: hidden; background-color: #f8f8f8;">
            ${badge}
            ${
              cp.parts.images && cp.parts.images[0]
                ? `<a href="${clickTrackingUrl}"><img src="${cp.parts.images[0]}" alt="${cp.parts.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;"></a>`
                : ""
            }
          </div>
          <div style="padding: 20px; text-align: center;">
            <div style="font-size: 16px; color: #1a1a1a; margin-bottom: 8px; font-weight: bold; min-height: 40px; display: flex; align-items: center; justify-content: center;">
              ${cp.parts.name}
            </div>
            ${
              cp.parts.sku
                ? `<div style="font-size: 11px; color: #999; margin-bottom: 12px; letter-spacing: 0.5px;">SKU: ${cp.parts.sku}</div>`
                : ""
            }
            <div style="font-size: 24px; color: #1a1a1a; font-weight: bold; margin-bottom: 15px;">
              ${
                hasSale
                  ? `<span style="text-decoration: line-through; color: #999; font-size: 16px; margin-right: 8px;">$${cp.parts.retail_price}</span>`
                  : ""
              }
              $${cp.parts.retail_price}
            </div>
            <a href="${clickTrackingUrl}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 11px 28px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 6px;">VIEW PRODUCT</a>
          </div>
        </div>
      `;
    })
    .join("");

  // Split products into rows of 2
  let gridHtml = "";
  const productsArray = campaignParts.map((cp, index) => {
    const clickTrackingUrl = `${baseUrl}/api/track/click?c=${
      campaign.id
    }&e=${encodeURIComponent(customer.email)}&p=${cp.parts.id}`;

    const hasSale = cp.parts.retail_price > cp.parts.customer_price;
    const badge = hasSale
      ? `<span style="position: absolute; top: 12px; right: 12px; background-color: #c41e3a; color: white; padding: 6px 14px; font-size: 11px; font-weight: bold; border-radius: 4px; z-index: 10;">SALE</span>`
      : "";

    return `
      <td width="50%" style="padding: 10px;" valign="top">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border: 2px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <tr>
            <td style="position: relative;">
              ${badge}
              ${
                cp.parts.images && cp.parts.images[0]
                  ? `<a href="${clickTrackingUrl}"><img src="${cp.parts.images[0]}" alt="${cp.parts.name}" width="100%" style="display: block; height: 220px; object-fit: cover;"></a>`
                  : `<div style="width: 100%; height: 220px; background-color: #f8f8f8;"></div>`
              }
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center;">
              <div style="font-size: 16px; color: #1a1a1a; margin-bottom: 8px; font-weight: bold; min-height: 40px;">
                ${cp.parts.name}
              </div>
              ${
                cp.parts.sku
                  ? `<div style="font-size: 11px; color: #999; margin-bottom: 12px; letter-spacing: 0.5px;">SKU: ${cp.parts.sku}</div>`
                  : ""
              }
              <div style="font-size: 24px; color: #1a1a1a; font-weight: bold; margin-bottom: 15px;">
                ${
                  hasSale
                    ? `<span style="text-decoration: line-through; color: #999; font-size: 16px; margin-right: 8px;">$${cp.parts.retail_price}</span>`
                    : ""
                }
                $${cp.parts.retail_price}
              </div>
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 6px;">
                    <a href="${clickTrackingUrl}" style="display: inline-block; color: white; padding: 11px 28px; text-decoration: none; font-size: 13px; font-weight: bold;">VIEW PRODUCT</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    `;
  });

  // Create rows of 2 products
  for (let i = 0; i < productsArray.length; i += 2) {
    gridHtml += `
      <tr>
        ${productsArray[i]}
        ${
          productsArray[i + 1] || '<td width="50%" style="padding: 10px;"></td>'
        }
      </tr>
    `;
  }

  // Tracking pixel for open tracking
  const trackingPixelUrl = `${baseUrl}/api/track/open?c=${
    campaign.id
  }&e=${encodeURIComponent(customer.email)}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="650" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 650px;">
              
              <!-- Hero Header with Pattern Background (Works in most clients) -->
              <tr>
                <td background="https://gsadmhqpzhkmgmcvxbdi.supabase.co/storage/v1/object/public/product-images/hero_background.png" bgcolor="#1a1f3a" style="background-image: url('${
                  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                }/hero-background.png'); background-size: cover; background-position: center; padding: 50px 20px; text-align: center;">
                  <!--[if gte mso 9]>
                  <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="border: 0; display: inline-block; width: 650px; height: 300px;" src="${
                    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                  }/hero-background.png" />
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="border: 0; display: inline-block; position: absolute; width: 650px; height: 300px;">
                  <v:fill opacity="0%" color="#1a1f3a" />
                  <v:textbox inset="0,0,0,0">
                  <![endif]-->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background-color: rgba(0, 0, 0, 0.6); padding: 30px; border-radius: 8px;">
                        <!-- Logo -->
                        <img src="https://gsadmhqpzhkmgmcvxbdi.supabase.co/storage/v1/object/public/product-images/logo.png" alt="CoreComponents" style="max-width: 250px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                        
                        <!-- Headline -->
                        <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: bold; line-height: 1.3;">${
                          campaign.headline
                        }</h1>
                      </td>
                    </tr>
                  </table>
                  <!--[if gte mso 9]>
                  </v:textbox>
                  </v:rect>
                  <![endif]-->
                </td>
              </tr>

              <!-- Announcement Bar -->
              <tr>
                <td style="background-color: #c41e3a; color: white; text-align: center; padding: 15px; font-size: 14px; font-weight: bold;">
                  🚚 FREE SHIPPING ON ORDERS OVER $500 | SHOP NOW
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px;">
                  <!-- Section Header -->
                  <h2 style="font-size: 28px; color: #1a1a1a; margin: 0 0 10px 0; text-align: center;">Featured Products</h2>
                  <p style="text-align: center; font-size: 15px; color: #666; margin: 0 0 35px 0;">Professional-grade parts, all in stock and ready to ship</p>

                  <!-- Products Grid -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${gridHtml}
                  </table>

                  <!-- Trust Badges -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f8f8; margin: 40px 0 0 0; border-radius: 10px;">
                    <tr>
                      <td style="padding: 35px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="33%" align="center" valign="top" style="padding: 0 10px;">
                              <div style="font-size: 36px; margin-bottom: 12px;">🚚</div>
                              <div style="font-size: 14px; font-weight: bold; color: #1a1a1a; margin-bottom: 5px;">Fast Shipping</div>
                              <div style="font-size: 12px; color: #666;">Same day dispatch</div>
                            </td>
                            <td width="33%" align="center" valign="top" style="padding: 0 10px;">
                              <div style="font-size: 36px; margin-bottom: 12px;">✓</div>
                              <div style="font-size: 14px; font-weight: bold; color: #1a1a1a; margin-bottom: 5px;">Quality Guaranteed</div>
                              <div style="font-size: 12px; color: #666;">DOT certified</div>
                            </td>
                            <td width="33%" align="center" valign="top" style="padding: 0 10px;">
                              <div style="font-size: 36px; margin-bottom: 12px;">🔧</div>
                              <div style="font-size: 14px; font-weight: bold; color: #1a1a1a; margin-bottom: 5px;">Expert Support</div>
                              <div style="font-size: 12px; color: #666;">Technical assistance</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Section -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f8f8; margin-top: 40px; border-radius: 10px;">
                    <tr>
                      <td style="padding: 40px; text-align: center;">
                        <h2 style="font-size: 26px; margin: 0 0 12px 0; color: #1a1a1a;">Need Help Finding the Right Parts?</h2>
                        <p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0 0 25px 0;">Our experienced team is ready to assist with parts selection and compatibility checks.</p>
                        <table cellpadding="0" cellspacing="0" border="0" align="center">
                          <tr>
                            <td style="background-color: #c41e3a; border-radius: 6px;">
                              <a href="${baseUrl}/contact" style="display: inline-block; color: white; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 15px;">CONTACT US</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #1a1a1a; color: white; padding: 40px; text-align: center;">
                  <div style="font-size: 26px; font-weight: bold; margin-bottom: 15px; letter-spacing: 2px;">CORECOMPONENTS</div>
                  <div style="font-size: 14px; line-height: 1.9; margin-bottom: 25px; opacity: 0.9;">
                    📍 Brampton, Ontario, Canada<br>
                    📞 (647) 993-8235<br>
                    📧 info@ccomponents.ca<br>
                    🌐 ccomponents.ca
                  </div>
                  <div style="margin: 25px 0;">
                    <a href="#" style="color: #FFD700; text-decoration: none; margin: 0 12px; font-size: 14px;">Facebook</a>
                    <a href="#" style="color: #FFD700; text-decoration: none; margin: 0 12px; font-size: 14px;">Instagram</a>
                    <a href="#" style="color: #FFD700; text-decoration: none; margin: 0 12px; font-size: 14px;">LinkedIn</a>
                  </div>
                  <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 12px;">
                    <a href="${baseUrl}" style="color: #ccc; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="${baseUrl}" style="color: #ccc; text-decoration: none; margin: 0 10px;">Terms</a> | 
                    <a href="${baseUrl}/unsubscribe?token=${
    customer.unsubscribe_token
  }" style="color: #ccc; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
                  </div>
                  <p style="margin-top: 20px; font-size: 11px; color: #999;">
                    You're receiving this email because you subscribed to CoreComponents.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Tracking Pixel -->
      <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:block;" />
    </body>
    </html>
  `;
}
