import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    )

  const { bookingId } = await req.json()

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: { select: { name: true } } },
  })

  if (!booking)
    return NextResponse.json(
      { error: "Booking not found", success: false },
      { status: 404 }
    )
  if (booking.studentId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden", success: false },
      { status: 403 }
    )
  }
  if (booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Booking must be confirmed before payment", success: false },
      { status: 400 }
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Tutoring session: ${booking.subject} with ${booking.tutor.name}`,
          },
          unit_amount: Math.round(booking.price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/bookings?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/bookings?payment=cancelled`,
    metadata: { bookingId: booking.id },
  })

  // Payment record create/update - PENDING obosthay, webhook wiil be do PAID
  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: { stripeSessionId: session.id, status: "PENDING" },
    create: {
      bookingId: booking.id,
      stripeSessionId: session.id,
      amount: booking.price,
      status: "PENDING",
    },
  })

  return NextResponse.json({
    data: { url: session.url },
    success: true,
    message: "Session generated successfully!",
  })
}
