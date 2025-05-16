import { z } from "zod"

// Define the schema for validation
export const subtopicSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    topic_id: z.string().uuid({
        message: "Topic ID is required.",
    }),
    description: z.string().optional(),
    is_active: z.boolean(),
    is_shelved: z.boolean().default(false),
})

// Export the type here instead of in the server actions file
export type SubtopicFormValues = z.infer<typeof subtopicSchema>
