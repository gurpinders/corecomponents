import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const yourPhone = process.env.YOUR_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send SMS notification for new quote request
 */
export async function sendQuoteNotification(quoteData) {
  try {
    const message = `
🔔 NEW QUOTE REQUEST!

Customer: ${quoteData.customer_name}
Email: ${quoteData.customer_email}
${quoteData.customer_company ? `Company: ${quoteData.customer_company}` : ""}
Phone: ${quoteData.customer_phone || "Not provided"}

Part: ${quoteData.part_name || "Multiple items"}
Quantity: ${quoteData.quantity}

${quoteData.message ? `Message: ${quoteData.message}` : ""}

View details: ccomponents.ca/admin/quotes
    `.trim();

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: yourPhone,
    });

    console.log("✅ Quote SMS notification sent");
    return { success: true };
  } catch (error) {
    console.error("❌ SMS notification error:", error);
    // Don't throw error - we don't want SMS failure to break the quote submission
    return { success: false, error: error.message };
  }
}

/**
 * Send SMS notification for new order/purchase
 */
export async function sendOrderNotification(orderData) {
  try {
    const itemsList = orderData.items
      .map((item) => `- ${item.name} (x${item.quantity}) $${item.price}`)
      .join("\n");

    const message = `
💰 NEW ORDER!

Customer: ${orderData.customer_name}
Email: ${orderData.customer_email}
Phone: ${orderData.customer_phone}

Items:
${itemsList}

Subtotal: $${orderData.subtotal}
Tax: $${orderData.tax}
TOTAL: $${orderData.total}

Delivery: ${orderData.delivery_method}
${orderData.delivery_address ? `Address: ${orderData.delivery_address}` : ""}

View details: ccomponents.ca/admin/orders
    `.trim();

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: yourPhone,
    });

    console.log("✅ Order SMS notification sent");
    return { success: true };
  } catch (error) {
    console.error("❌ SMS notification error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send generic SMS notification
 */
export async function sendSMS(message) {
  try {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: yourPhone,
    });

    console.log("✅ SMS sent");
    return { success: true };
  } catch (error) {
    console.error("❌ SMS error:", error);
    return { success: false, error: error.message };
  }
}
