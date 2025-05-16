"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { topicSchema } from "@/lib/schemas/topic-schema"

// Get all topics with pagination and search
export async function getTopics({
    page = 1,
    pageSize = 10,
    search = "",
    showShelved = false,
    subjectId = "",
}: {
    page?: number
    pageSize?: number
    search?: string
    showShelved?: boolean
    subjectId?: string
}) {
    const supabase = await createClient()

    // Calculate the range for Supabase query
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build the query
    let query = supabase
        .from("topics")
        .select("*, subjects(name)", { count: "exact" })
        .eq("is_deleted", false)
        .range(from, to)
        .order("created_at", { ascending: false })

    // Add search if provided
    if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Filter by shelved status if not showing shelved
    if (!showShelved) {
        query = query.eq("is_shelved", false)
    }

    // Filter by subject ID if provided
    if (subjectId) {
        query = query.eq("subject_id", subjectId)
    }

    // Execute the query
    const { data, count, error } = await query

    if (error) {
        console.error("Error fetching topics:", error)
        throw new Error("Failed to fetch topics")
    }

    return {
        data,
        count,
        pageCount: count ? Math.ceil(count / pageSize) : 0,
    }
}

// Get a single topic by ID
export async function getTopicById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("topics")
        .select("*, subjects(name)")
        .eq("id", id)
        .eq("is_deleted", false)
        .single()

    if (error) {
        console.error("Error fetching topic:", error)
        throw new Error("Failed to fetch topic")
    }

    return data
}

// Create a new topic
export async function createTopic(formData: any) {
    const supabase = await createClient()

    // Validate the form data
    const result = topicSchema.safeParse(formData)

    if (!result.success) {
        return { error: result.error.format() }
    }

    const { data, error } = await supabase.from("topics").insert(result.data).select().single()

    if (error) {
        console.error("Error creating topic:", error)
        return { error: "Failed to create topic" }
    }

    revalidatePath("/admin/topics")
    return { data }
}

// Update an existing topic
export async function updateTopic(id: string, formData: any) {
    const supabase = await createClient()

    // Validate the form data
    const result = topicSchema.safeParse(formData)

    if (!result.success) {
        return { error: result.error.format() }
    }

    const { data, error } = await supabase.from("topics").update(result.data).eq("id", id).select().single()

    if (error) {
        console.error("Error updating topic:", error)
        return { error: "Failed to update topic" }
    }

    revalidatePath("/admin/topics")
    return { data }
}

// Toggle shelved status
export async function toggleTopicShelved(id: string, isShelved: boolean) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("topics").update({ is_shelved: isShelved }).eq("id", id).select().single()

    if (error) {
        console.error("Error toggling topic shelved status:", error)
        return { error: "Failed to update topic" }
    }

    revalidatePath("/admin/topics")
    return { data }
}

// Delete a topic (soft delete)
export async function deleteTopic(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("topics").update({ is_deleted: true }).eq("id", id)

    if (error) {
        console.error("Error deleting topic:", error)
        return { error: "Failed to delete topic" }
    }

    revalidatePath("/admin/topics")
    return { success: true }
}

// Hard delete a topic (for admin purposes)
export async function hardDeleteTopic(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("topics").delete().eq("id", id)

    if (error) {
        console.error("Error hard deleting topic:", error)
        return { error: "Failed to delete topic" }
    }

    revalidatePath("/admin/topics")
    return { success: true }
}
