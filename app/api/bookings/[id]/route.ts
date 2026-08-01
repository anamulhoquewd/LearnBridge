import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "REJECTED", "COMPLETED", "CANCELLED"]),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    )

  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking)
    return NextResponse.json(
      { error: "Booking not found", success: false },
      { status: 404 }
    )

  // Only the tutor involved in this booking can accept/reject
  if (booking.tutorId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden", success: false },
      { status: 403 }
    )
  }

  const body = await req.json()
  console.log("Body: ", body)
  const parsed = updateStatusSchema.safeParse(body)
  console.log("Parsed: ", parsed)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status", success: false },
      { status: 400 }
    )
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  })

  return NextResponse.json({
    data: updated,
    success: true,
    message: "Booking updated successfully!",
  })
}
