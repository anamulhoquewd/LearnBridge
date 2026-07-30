import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { studentProfileSchema } from "@/lib/zod/schemas"
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
    const profile = await prisma.profile.findUnique({
      where: {
        id: user.id,
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
  const parsed = studentProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error, success: false },
      { status: 400 }
    )
  }

  const { name } = parsed.data

  try {
    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: name ? { name } : {},
    })

    return NextResponse.json({
      data: profile,
      message: "Student profile updated successfully!",
      success: true,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Someting went wrong", success: false },
      { status: 500 }
    )
  }
}
