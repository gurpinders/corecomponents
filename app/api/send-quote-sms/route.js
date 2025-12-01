import { sendQuoteNotification } from '@/lib/sms'

export async function POST(request) {
  try {
    const quoteData = await request.json()

    // Send SMS notification
    await sendQuoteNotification(quoteData)

    return Response.json({ success: true })
  } catch (error) {
    console.error('SMS notification error:', error)
    // Don't fail the request if SMS fails
    return Response.json({ success: false, error: error.message }, { status: 200 })
  }
}