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

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

export type BookingStatus =
  "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED"

export interface Review {
  rating: number
  id: string
  createdAt: Date
  bookingId: string
  authorId: string
  comment: string | null

  author: {
    name: string
    avatar: string | null
  }
}

export interface Booking {
  studentId: string
  tutorId: string
  subject: string
  dateTime: string
  price: number
  status: BookingStatus
}
