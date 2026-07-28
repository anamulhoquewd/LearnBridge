export interface Tutor {
  id: string
  userId: string
  subjects: string[]
  hourlyRate: number
  bio: string
  avgRating: number
  totalReviews: number
  experience: number
  user: { name: string; avatar: string | null; email: string }
}

export type Role = "TUTOR" | "STUDENT"
