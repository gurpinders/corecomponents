function stockBadge(part) {
  const status = part.stock_status;
  const label =
    status === "in_stock"
      ? "In Stock"
      : status === "low_stock"
        ? "Low Stock"
        : "Out of Stock";
  const color =
    status === "in_stock"
      ? "#4ade80"
      : status === "low_stock"
        ? "#facc15"
        : "#f87171";
  const bg =
    status === "in_stock"
      ? "rgba(74,222,128,0.1)"
      : status === "low_stock"
        ? "rgba(250,204,21,0.1)"
        : "rgba(248,113,113,0.1)";
  return `<span style="display:inline-block;background:${bg};color:${color};font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">${label}</span>`;
}

function pageFooter() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
            <td style="padding:16px 0;border-top:1px solid rgba(255,255,255,0.07);font-size:10px;color:rgba(255,255,255,0.3);">
                CoreComponents · Brampton, Ontario · ccomponents.ca · (647) 993-8235
            </td>
        </tr>
    </table>`;
}

function pageWrapper(innerHtml) {
  return `
    <div style="width:800px;background:#0a0a0a;padding:40px;font-family:Arial,sans-serif;box-sizing:border-box;">
        ${innerHtml}
        ${pageFooter()}
    </div>`;
}

function buildCoverPage({ promoMessage }) {
  const content = `
        <div style="margin-bottom:48px;">
            <img src="/logo_white.png" alt="CoreComponents" height="56" style="display:block;height:56px;width:auto;" />
        </div>
        <div style="background:linear-gradient(135deg,#001f54,#000d2e);border-radius:16px;padding:64px 48px;text-align:center;">
            <p style="margin:0 0 20px;display:inline-block;border:1px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:6px 16px;border-radius:20px;">This Week's Stock</p>
            <h1 style="margin:0 0 16px;font-size:42px;font-weight:800;color:#ffffff;line-height:1.2;">${promoMessage}</h1>
            <p style="margin:0 0 32px;font-size:16px;color:rgba(255,255,255,0.6);">In-stock parts ready for same-day dispatch across the GTA.</p>
            <span style="display:inline-block;background:#ffffff;color:#001f54;padding:16px 40px;border-radius:8px;font-weight:800;font-size:18px;">📞 Call (647) 993-8235</span>
        </div>
    `;
  return pageWrapper(content);
}

function buildCategoryPage({ categoryName, parts }) {
  const rows = [];
  for (let i = 0; i < parts.length; i += 3) {
    rows.push(parts.slice(i, i + 3));
  }

  const rowsHTML = rows
    .map((rowParts) => {
      const cells = rowParts
        .map(
          (part) => `
            <td style="width:33.33%;padding:8px;vertical-align:top;">
                <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;">
                    ${
                      part.images && part.images[0]
                        ? `<img src="${part.images[0]}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;display:block;margin-bottom:12px;" />`
                        : `<div style="width:100%;height:140px;background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:12px;"></div>`
                    }
                    <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#fbbf24;">$${Number(part.price || 0).toFixed(2)}</p>
                    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">${part.name}</p>
                    <p style="margin:0 0 8px;font-size:11px;color:rgba(255,255,255,0.4);">${part.sku || part.description || ""}</p>
                    ${stockBadge(part)}
                </div>
            </td>
        `,
        )
        .join("");
      const padCount = 3 - rowParts.length;
      const padding = Array(padCount)
        .fill('<td style="width:33.33%;"></td>')
        .join("");
      return `<tr>${cells}${padding}</tr>`;
    })
    .join("");

  const content = `
        <div style="background:#001f54;border-radius:8px;padding:14px 24px;margin-bottom:24px;">
            <h2 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">${categoryName}</h2>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
            ${rowsHTML}
        </table>
    `;
  return pageWrapper(content);
}

function buildClosingPage() {
  const content = `
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:64px 48px;text-align:center;">
            <h2 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#ffffff;">Ready to order?</h2>
            <p style="margin:0 0 32px;font-size:14px;color:rgba(255,255,255,0.5);">Call or text us for pricing confirmation, availability, and same-day GTA delivery.</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                    <td style="padding-right:12px;">
                        <span style="display:inline-block;background:#ffffff;color:#000000;padding:14px 28px;border-radius:8px;font-weight:800;font-size:14px;">📞 Call Us</span>
                    </td>
                    <td>
                        <span style="display:inline-block;background:#001f54;color:#ffffff;padding:14px 28px;border-radius:8px;font-weight:800;font-size:14px;">💬 Text Us</span>
                    </td>
                </tr>
            </table>
        </div>
    `;
  return pageWrapper(content);
}

export function generateFlyerPages({ promoMessage, categorizedParts }) {
  const pages = [];
  pages.push(buildCoverPage({ promoMessage }));
  categorizedParts.forEach(({ categoryName, parts }) => {
    if (parts.length > 0) {
      pages.push(buildCategoryPage({ categoryName, parts }));
    }
  });
  pages.push(buildClosingPage());
  return pages;
}
