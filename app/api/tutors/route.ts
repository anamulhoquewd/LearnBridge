import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subjects = searchParams.getAll("subject")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const query = searchParams.get("q")

  try {
    const where = {
      ...(subjects.length && {
        subjects: {
          hasSome: subjects,
        },
      }),

      ...(minPrice && {
        hourlyRate: {
          gte: Number(minPrice),
        },
      }),

      ...(maxPrice && {
        hourlyRate: {
          lte: Number(maxPrice),
        },
      }),

      ...(query && {
        OR: [
          {
            bio: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
    } satisfies Prisma.TutorProfileWhereInput

    const tutors = await prisma.tutorProfile.findMany({
      where,
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { avgRating: "desc" },
    })

    return NextResponse.json({
      data: tutors,
      message: "Tutors list cooked successfully!",
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Someting went wrong", success: false },
      { status: 500 }
    )
  }
}
