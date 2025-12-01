import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const yourPhone = process.env.YOUR_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS notification for new quote request
 * SHORT VERSION for Twilio trial (160 char limit)
 */
export async function sendQuoteNotification(quoteData) {
  try {
    // Keep it VERY short for trial accounts
    const message = `🔔 Quote: ${quoteData.customer_name} (${quoteData.customer_email}) - ${quoteData.part_name}`;

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: yourPhone,
    });

    console.log("✅ Quote SMS sent");
    return { success: true };
  } catch (error) {
    console.error("❌ SMS error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send SMS notification for new order/purchase
 * SHORT VERSION for Twilio trial (160 char limit)
 */
export async function sendOrderNotification(orderData) {
  try {
    const message = `💰 Order: ${orderData.customer_name} - $${orderData.total} (${orderData.items.length} items)`;

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: yourPhone,
    });

    console.log("✅ Order SMS sent");
    return { success: true };
  } catch (error) {
    console.error("❌ SMS error:", error);
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
