import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { createBookingSchemaApi } from "@/lib/zod/schemas"
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

  // NEW: Role Check — Only students can create bookings.
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || profile.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Only students can create booking requests", success: false },
      { status: 403 }
    )
  }

  const body = await req.json()
  const parsed = createBookingSchemaApi.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error, success: false },
      { status: 400 }
    )
  }

  const { tutorId, subject, dateTime, duration } = parsed.data

  // NEW: Check if the tutor is trying to book themselves (self-booking prevention).
  if (tutorId === user.id) {
    return NextResponse.json(
      { error: "You cannot book yourself", success: false },
      { status: 400 }
    )
  }

  // Fetch tutor's hourly rate to calculate price
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorId },
  })

  if (!tutorProfile) {
    return NextResponse.json(
      { error: "Tutor not found", success: false },
      { status: 404 }
    )
  }

  const price = (tutorProfile.hourlyRate / 60) * duration

  const booking = await prisma.booking.create({
    data: {
      studentId: user.id,
      tutorId,
      subject,
      dateTime: new Date(dateTime),
      duration,
      price,
      status: "PENDING",
    },
  })

  return NextResponse.json(
    { data: booking, messaege: "Booking created successfull!", success: true },
    { status: 201 }
  )
}

// GET /api/bookings - role-aware list (student sees own bookings, tutor sees own)
export async function GET(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    )

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile)
    return NextResponse.json(
      { error: "Profile not found", success: false },
      { status: 404 }
    )

  const bookings = await prisma.booking.findMany({
    where:
      profile.role === "TUTOR" ? { tutorId: user.id } : { studentId: user.id },
    include: {
      student: { select: { name: true, email: true, avatar: true } },
      tutor: {
        select: {
          name: true,
          email: true,
          avatar: true,
          tutorProfile: {
            select: { avgRating: true, totalReviews: true, bio: true },
          },
        },
      },
      payment: { select: { status: true } },
    },
    orderBy: { dateTime: "desc" },
  })

  return NextResponse.json({
    data: bookings,
    message: "Booking found successfull!",
    success: true,
  })
}
