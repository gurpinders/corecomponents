import { sendOrderNotification } from "@/lib/sms";

export async function POST(request) {
  try {
    const orderData = await request.json();

    // Send SMS notification
    await sendOrderNotification(orderData);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Order SMS notification error:", error);
    // Don't fail the request if SMS fails
    return Response.json(
      { success: false, error: error.message },
      { status: 200 }
    );
  }
}
