import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { tutorProfileSchema } from "@/lib/zod/schemas"
import { NextResponse } from "next/server"

// GET - Fetch the logged-in tutor's own profile
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const profile = await prisma.tutorProfile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: { select: { name: true, avatar: true, email: true } },
      },
    })
    return NextResponse.json({
      data: profile,
      message: "Profile found successfully!",
      success: true,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Someting went wrong", success: false },
      { status: 500 }
    )
  }
}

// PUT - create or update (upsert)
export async function PUT(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = tutorProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error, success: false },
      { status: 400 }
    )
  }

  const { subjects, hourlyRate, bio, experience, name } = parsed.data

  try {
    const updated = await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      update: { subjects, hourlyRate, bio, experience },
      create: { userId: user.id, subjects, hourlyRate, bio, experience },
    })

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: name ? { name } : {},
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    })

    return NextResponse.json({
      data: {
        ...updated,
        user: profile,
      },
      message: "Tutor profile updated successfully!",
      success: true,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Someting went wrong", success: false },
      { status: 500 }
    )
  }
}
