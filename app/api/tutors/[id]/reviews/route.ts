import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // this is TutorProfile.id

  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { id } })
  if (!tutorProfile)
    return NextResponse.json(
      { error: "Not found", success: false },
      { status: 404 }
    )

  const reviews = await prisma.review.findMany({
    where: { booking: { tutorId: tutorProfile.userId } },
    include: { author: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    data: reviews,
    message: "Reviews fetched successfully",
    success: true,
  })
}
