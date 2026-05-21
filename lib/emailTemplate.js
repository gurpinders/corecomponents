export function generateCampaignEmail({ promoMessage, parts, trucks = [] }) {
  const partsHTML = parts
    .map(
      (part) => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07);">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="56" valign="top">
                            ${
                              part.images && part.images[0]
                                ? `<img src="${part.images[0]}" width="56" height="56" style="border-radius:8px;object-fit:cover;display:block;" />`
                                : `<div style="width:56px;height:56px;background:rgba(255,255,255,0.05);border-radius:8px;"></div>`
                            }
                        </td>
                        <td style="padding-left:14px;" valign="top">
                            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${part.name}</p>
                            <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">${part.description || ""}</p>
                            <span style="display:inline-block;margin-top:6px;background:rgba(74,222,128,0.1);color:#4ade80;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">In Stock</span>
                        </td>
                        <td width="100" valign="top" align="right">
                            <a href="https://ccomponents.ca/catalog/${part.id}" style="display:inline-block;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-size:11px;padding:6px 12px;border-radius:6px;text-decoration:none;">View Part</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `,
    )
    .join("");

  const trucksHTML = trucks
    .map(
      (truck) => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07);">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="56" valign="top">
                            ${
                              truck.images && truck.images[0]
                                ? `<img src="${truck.images[0]}" width="56" height="56" style="border-radius:8px;object-fit:cover;display:block;" />`
                                : `<div style="width:56px;height:56px;background:rgba(255,255,255,0.05);border-radius:8px;"></div>`
                            }
                        </td>
                        <td style="padding-left:14px;" valign="top">
                            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${truck.year} ${truck.make} ${truck.model}</p>
                            <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">${truck.description || ""}</p>
                            <span style="display:inline-block;margin-top:6px;background:rgba(74,222,128,0.1);color:#4ade80;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">Available</span>
                        </td>
                        <td width="100" valign="top" align="right">
                            <a href="https://ccomponents.ca/trucks/${truck.id}" style="display:inline-block;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-size:11px;padding:6px 12px;border-radius:6px;text-decoration:none;">View Truck</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#111111;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;">
    <tr><td align="center" style="padding:20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
                <td style="background:#0a0a0a;padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.1);">
                    <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">CoreComponents</p>
                    <p style="margin:2px 0 0;font-size:11px;color:rgba(255,255,255,0.3);">Weekly Inventory</p>
                </td>
            </tr>

            <!-- Hero -->
            <tr>
                <td style="background:linear-gradient(135deg,#001f54,#000d2e);padding:40px 32px;text-align:center;">
                    <p style="margin:0 0 16px;display:inline-block;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:20px;">This Week's Stock</p>
                    <h1 style="margin:0 0 12px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">${promoMessage}</h1>
                    <p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.5);">In-stock parts ready for same-day dispatch across the GTA. Call or text us for pricing and availability.</p>
                    <a href="tel:6479938235" style="display:inline-block;background:#ffffff;color:#001f54;padding:12px 32px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;">📞 Call (647) 993-8235</a>
                </td>
            </tr>

            <!-- Parts -->
            ${
              parts.length > 0
                ? `
            <tr>
                <td style="background:#0a0a0a;padding:28px 32px;">
                    <p style="margin:0 0 16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Available Now</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        ${partsHTML}
                    </table>
                </td>
            </tr>`
                : ""
            }

            <!-- Trucks -->
            ${
              trucks.length > 0
                ? `
            <tr>
                <td style="background:#0a0a0a;padding:0 32px 28px;">
                    <p style="margin:0 0 16px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Trucks For Sale</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                        ${trucksHTML}
                    </table>
                </td>
            </tr>`
                : ""
            }

            <!-- CTA -->
            <tr>
                <td style="background:#0a0a0a;padding:0 32px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
                        <tr>
                            <td style="padding:20px 24px;">
                                <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#ffffff;">Ready to order?</p>
                                <p style="margin:0 0 14px;font-size:12px;color:rgba(255,255,255,0.4);">Call or text us for pricing, availability, and same-day GTA delivery.</p>
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-right:8px;">
                                            <a href="tel:6479938235" style="display:inline-block;background:#ffffff;color:#000000;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;">📞 Call Us</a>
                                        </td>
                                        <td>
                                            <a href="sms:6479938235" style="display:inline-block;background:#001f54;color:#ffffff;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;">💬 Text Us</a>
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
                <td style="background:#0a0a0a;padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="font-size:10px;color:rgba(255,255,255,0.2);">CoreComponents · Brampton, Ontario · ccomponents.ca</td>
                            <td align="right" style="font-size:10px;"><a href="https://ccomponents.ca/unsubscribe" style="color:rgba(255,255,255,0.2);text-decoration:none;">Unsubscribe</a></td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </td></tr>
</table>
</body>
</html>`;
}
