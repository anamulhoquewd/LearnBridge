import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text() // Need a raw body; don't use the parsed JSON.
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature", success: false },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      const p = await prisma.payment.update({
        where: { bookingId },
        data: { status: "PAID" },
      })

      // Optional: Keep the booking status as 'Confirmed' instead of moving it to 'Completed'.
      // Because the session hasn't taken place yet—only the payment has been made. It will be completed, After the session ends (manual/future feature).
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      await prisma.payment.update({
        where: { bookingId },
        data: { status: "FAILED" },
      })
    }
  }

  return NextResponse.json({ received: true })
}
