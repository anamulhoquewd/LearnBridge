import * as z from "zod"

export const tutorProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, "Kompokhe 1 ta subject select koro"),
  hourlyRate: z.number().min(1, "Rate 0 er beshi hote hobe"),
  bio: z.string().min(20, "Bio kompokhe 20 character hote hobe"),
  experience: z.number().min(0),
  name: z.string().optional(),
  email: z.email().optional(),
})

// Input type (form values)
export type TutorProfileFormInput = z.input<typeof tutorProfileSchema>

// Parsed type (after zod)
export type TutorProfileData = z.output<typeof tutorProfileSchema>

export const studentProfileSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
})

export type StudentProfileFormValues = z.infer<typeof studentProfileSchema>

export const createBookingSchemaApi = z.object({
  tutorId: z.string().min(1),
  subject: z.string().min(1, "Select a subject"),
  dateTime: z.string().min(1, "Select Date/time"), // ISO string from datetime-local input
  duration: z.number().min(30),
})

export type CreateBookingInputAPI = z.infer<typeof createBookingSchemaApi>

export const createBookingSchema = z.object({
  tutorId: z.string().min(1),
  subject: z.string().min(1, "Select a subject"),
  date: z.date("Select booking date"),
  time: z.string().min(1, "Select booking time"), // "HH:mm" format
  duration: z.number().min(30),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>

export const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500),
})

export type CreateReviewSchema = z.infer<typeof createReviewSchema>
