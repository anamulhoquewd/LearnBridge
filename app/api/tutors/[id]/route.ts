import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, avatar: true, email: true } },
      },
    })

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found", success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: tutor,
      success: true,
      message: "Tutor found successfully!",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Someting went wrong", success: false },
      { status: 500 }
    )
  }
}
