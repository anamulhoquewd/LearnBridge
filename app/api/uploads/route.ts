import { prisma } from "@/lib/prisma"
import { uploadSingleFile } from "@/lib/r2/r2-utils"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("Unauthrized")
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    )
  }

  const formData = await req.formData()
  const file = formData.get("file")

  if (!file) {
    return NextResponse.json(
      { error: "No file provided", success: false },
      { status: 400 }
    )
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Invalid file", success: false },
      { status: 400 }
    )
  }

  try {
    const data = await uploadSingleFile(file, "profile-photos")
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message, success: false },
        { status: 400 }
      )
    }
    if (data.serverError) {
      return NextResponse.json(
        { error: data.serverError.message, success: false },
        { status: 500 }
      )
    }

    // up to date with profile
    if (data.success) {
      await prisma.profile.update({
        where: { id: user.id },
        data: { avatar: data.success.data.url },
      })
    }

    return NextResponse.json({
      data: data.success.data,
      message: data.success.message,
      success: data.success.success,
    })
  } catch (err) {
    console.error("R2 upload error:", err)
    return NextResponse.json(
      { error: "Upload failed", success: false },
      { status: 500 }
    )
  }
}
