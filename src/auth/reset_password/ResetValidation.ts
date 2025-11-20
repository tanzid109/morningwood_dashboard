import { z } from "zod";

export const resetSchema = z.object({
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters"),
    Cpassword: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters"),
});
