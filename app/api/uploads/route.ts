import { uploadSingleFile } from "@/lib/r2/r2-utils"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    )
  }

  // ------------

  // const body = await req.parseBody();
  // const file = body["avatar"] as File;
  // Check if file exists
  // if (!file) {
  //  return NextResponse.json({ error: "No image provided",success: false }, { status: 400 });
  // }

  // -------

  const body = await req.json()
  const { file } = body

  if (!file) {
    return NextResponse.json(
      { error: "No file provided", success: false },
      { status: 400 }
    )
  }

  try {
    const data = await uploadSingleFile(file, "profile-photos")
    if (!data.success) {
      return NextResponse.json(
        { error: data.error?.message, success: false },
        { status: 500 }
      )
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
