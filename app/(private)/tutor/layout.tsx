import { requireTutor } from "@/lib/auth"

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireTutor()

  return <>{children}</>
}
