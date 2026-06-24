import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  next: z.string().optional(),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2).max(80),
});
