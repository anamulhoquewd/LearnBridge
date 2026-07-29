import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { createReviewSchema } from "@/lib/zod/schemas"
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

  const body = await req.json()
  const parsed = createReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", success: false },
      { status: 400 }
    )
  }

  const { bookingId, rating, comment } = parsed.data

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking)
    return NextResponse.json(
      { error: "Booking not found", success: false },
      { status: 404 }
    )

  // Shudhu je student-er booking, shei-i review dite parbe
  if (booking.studentId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden", success: false },
      { status: 403 }
    )
  }

  const review = await prisma.review.create({
    data: { bookingId, authorId: user.id, rating, comment },
  })

  // TutorProfile-er avgRating + totalReviews recalculate koro
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: booking.tutorId },
  })

  if (tutorProfile) {
    const allReviews = await prisma.review.findMany({
      where: { booking: { tutorId: booking.tutorId } },
    })
    const avgRating =
      allReviews.reduce(
        (sum: number, r: { rating: number }) => sum + r.rating,
        0
      ) / allReviews.length

    await prisma.tutorProfile.update({
      where: { userId: booking.tutorId },
      data: { avgRating, totalReviews: allReviews.length },
    })
  }

  return NextResponse.json(
    { data: review, success: true, message: "Review written successfully!" },
    { status: 201 }
  )
}
