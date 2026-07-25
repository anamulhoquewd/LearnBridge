import * as z  from "zod";

export const tutorProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, "Kompokhe 1 ta subject select koro"),
  hourlyRate: z.coerce.number().min(1, "Rate 0 er beshi hote hobe"),
  bio: z.string().min(20, "Bio kompokhe 20 character hote hobe"),
  experience: z.coerce.number().min(0),
  avatar: z.string().optional(),
  name: z.string().optional(), email: z.email().optional()
});

export type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;