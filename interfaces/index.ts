import { Profile, Review, TutorProfile } from "@prisma/client"

export type TutorProfileWithUser = TutorProfile & {
  user: Profile
}

export type ReviewWithAuthor = Review & {
  author: Profile
}
