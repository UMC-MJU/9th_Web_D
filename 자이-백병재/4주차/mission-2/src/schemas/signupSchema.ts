import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be 8 characters or longer" })
    .max(20, { message: "Password cannot exceed 20 characters" }),
    confirmPassword: z.string().min(8).max(20),
    name: z.string().min(1, { message: "Please enter your name" })
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UserSignupInformation = z.infer<typeof signupSchema>;