import {z} from "zod";

export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    // confirmPassword: z.string().min(8),
});

export type RegisterSchema = z.infer<typeof registerSchema>;