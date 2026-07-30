import { StudentDashboard } from "@/components/student/student-dashboard"
import { TutorDashboard } from "@/components/tutor/tutor-dashboard"

export const metadata = {
  title: "Tutor Dashboard - TutorHub",
  description: "Your tutoring dashboard",
}

export default function TutorDashboardPage() {
  return <StudentDashboard />
}
