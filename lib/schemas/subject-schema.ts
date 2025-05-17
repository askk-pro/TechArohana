import { z } from "zod"

// Define the subject schema
export const subjectSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name must be less than 100 characters" }),
    description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional().nullable(),
    is_active: z.boolean().default(true),
    is_shelved: z.boolean().default(false),
})

// Export the type for use in forms
export type SubjectFormValues = z.infer<typeof subjectSchema>
