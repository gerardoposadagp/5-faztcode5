import { z } from "zod"

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
})

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  address: z.string().min(5, "Address is required."),
  phoneNumber: z.string().min(10, "A valid phone number is required."),
  age: z.coerce.number().min(18, "You must be at least 18 years old."),
})

export const projectSchema = z.object({
  id: z.string().optional(), // Optional for new projects
  name: z.string().min(3, "Project name is required and must be at least 3 characters."),
  status: z.enum(["Active", "Completed", "Pending", "On Hold"], {
    message: "Invalid project status.",
  }),
  progress: z.coerce.number().min(0).max(100, "Progress must be between 0 and 100."),
  dueDate: z.string().optional().nullable(), // Date as string for form, can be null
})
