import { PrismaClient } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

// Admin client - service_role key bypasses RLS and can create users directly
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createSeedUser({
  name,
  email,
  password,
  role,
}: {
  name: string
  email: string
  password: string
  role: "STUDENT" | "TUTOR"
}) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email verification for seed users
    user_metadata: { name, role },
  })

  if (error || !data.user) {
    throw new Error(`Failed to create auth user ${email}: ${error?.message}`)
  }

  return data.user.id
}

async function main() {
  const student1Id = await createSeedUser({
    name: "Sarah Ahmed",
    email: "student1@test.com",
    password: "Pass1234",
    role: "STUDENT",
  })
  await prisma.profile.create({
    data: {
      id: student1Id,
      name: "Sarah Ahmed",
      email: "student1@test.com",
      role: "STUDENT",
    },
  })

  const tutor1Id = await createSeedUser({
    name: "John Miller",
    email: "tutor1@test.com",
    password: "Pass1234",
    role: "TUTOR",
  })
  await prisma.profile.create({
    data: {
      id: tutor1Id,
      name: "John Miller",
      email: "tutor1@test.com",
      role: "TUTOR",
      tutorProfile: {
        create: {
          subjects: ["Mathematics", "Physics"],
          hourlyRate: 25,
          bio: "PhD in Physics with 8 years of teaching experience.",
          experience: 8,
          verified: true,
        },
      },
    },
  })

  const tutor2Id = await createSeedUser({
    name: "Emily Chen",
    email: "tutor2@test.com",
    password: "Pass1234",
    role: "TUTOR",
  })
  await prisma.profile.create({
    data: {
      id: tutor2Id,
      name: "Emily Chen",
      email: "tutor2@test.com",
      role: "TUTOR",
      tutorProfile: {
        create: {
          subjects: ["English", "IELTS Prep"],
          hourlyRate: 20,
          bio: "Certified English teacher, IELTS band 9.",
          experience: 5,
          verified: true,
        },
      },
    },
  })

  console.log("Seed complete:", { student1Id, tutor1Id, tutor2Id })
}

main()
  .catch((error) => console.log(error))
  .finally(async () => await prisma.$disconnect())
