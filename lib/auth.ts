import { redirect } from "next/navigation"
import { prisma } from "./prisma"
import { createClient } from "./supabase/server"

export async function loggedInUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
    select: {
      role: true,
      name: true,
      email: true,
      avatar: true,
    },
  })

  if (!profile) {
    throw new Error(`Profile not found for authenticated user ${user.id}`)
  }

  return { user, profile }
}

export async function requireTutor() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  })

  if (profile?.role !== "TUTOR") {
    redirect("/s/dashboard")
  }

  return user
}

export async function requireStudent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  })

  if (profile?.role !== "STUDENT") {
    redirect("/t/dashboard")
  }

  return user
}
