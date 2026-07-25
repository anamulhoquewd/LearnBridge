import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import * as z from "zod"

const signupSchemaZod = z.object({
  name: z.string().min(2).max(32),
  email: z.email(),
  password: z.string().min(8).max(32),
  role: z.enum(["TUTOR", "STUDENT"]),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = signupSchemaZod.safeParse(body)


    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error },
        { status: 400 }
      )
    }

    const { name, email, password, role } = validatedData.data

    const supabase = await createClient()

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })

    if (authError || !authData) {
      return NextResponse.json(
        {
          success: false,
          error: authError?.message || "SignUp failed!",
          code: authError?.code || "UNKNOWN_ERROR",
        },
        { status: 400 }
      )
    }

    // Step 2: Create matching Profile row (id = Supabase auth UID)
    await prisma.profile.create({
      data: {
        id: authData.user?.id as string,
        name,
        email,
        role,
        ...(role === "TUTOR" && {
          tutorProfile: {
            create: {
              bio: "",
              hourlyRate: 1000,
              avgRating: 0,
              experience: 2,
            },
          },
        }),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: { id: authData.user?.id, email: authData.user?.email },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body", success: false },
      { status: 400 }
    )
  }
}
