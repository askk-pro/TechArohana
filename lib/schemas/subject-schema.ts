import { z } from "zod"

// Define the schema for validation
export const subjectSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    is_active: z.boolean(),
})

// Export the type here instead of in the server actions file
export type SubjectFormValues = z.infer<typeof subjectSchema>
