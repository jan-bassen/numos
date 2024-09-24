import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().max(20).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});
