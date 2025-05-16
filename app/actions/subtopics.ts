"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { subtopicSchema } from "@/lib/schemas/subtopic-schema"

// Get all subtopics with pagination and search
export async function getSubtopics({
    page = 1,
    pageSize = 10,
    search = "",
    showShelved = false,
    topicId = "",
}: {
    page?: number
    pageSize?: number
    search?: string
    showShelved?: boolean
    topicId?: string
}) {
    const supabase = await createClient()

    // Calculate the range for Supabase query
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build the query
    let query = supabase
        .from("sub_topics")
        .select("*, topics(name, subject_id, subjects(name))", { count: "exact" })
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

    // Filter by topic ID if provided
    if (topicId) {
        query = query.eq("topic_id", topicId)
    }

    // Execute the query
    const { data, count, error } = await query

    if (error) {
        console.error("Error fetching subtopics:", error)
        throw new Error("Failed to fetch subtopics")
    }

    return {
        data,
        count,
        pageCount: count ? Math.ceil(count / pageSize) : 0,
    }
}

// Get a single subtopic by ID
export async function getSubtopicById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("sub_topics")
        .select("*, topics(name, subject_id, subjects(name))")
        .eq("id", id)
        .eq("is_deleted", false)
        .single()

    if (error) {
        console.error("Error fetching subtopic:", error)
        throw new Error("Failed to fetch subtopic")
    }

    return data
}

// Create a new subtopic
export async function createSubtopic(formData: any) {
    const supabase = await createClient()

    // Validate the form data
    const result = subtopicSchema.safeParse(formData)

    if (!result.success) {
        return { error: result.error.format() }
    }

    const { data, error } = await supabase.from("sub_topics").insert(result.data).select().single()

    if (error) {
        console.error("Error creating subtopic:", error)
        return { error: "Failed to create subtopic" }
    }

    revalidatePath("/admin/subtopics")
    return { data }
}

// Update an existing subtopic
export async function updateSubtopic(id: string, formData: any) {
    const supabase = await createClient()

    // Validate the form data
    const result = subtopicSchema.safeParse(formData)

    if (!result.success) {
        return { error: result.error.format() }
    }

    const { data, error } = await supabase.from("sub_topics").update(result.data).eq("id", id).select().single()

    if (error) {
        console.error("Error updating subtopic:", error)
        return { error: "Failed to update subtopic" }
    }

    revalidatePath("/admin/subtopics")
    return { data }
}

// Toggle shelved status
export async function toggleSubtopicShelved(id: string, isShelved: boolean) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("sub_topics")
        .update({ is_shelved: isShelved })
        .eq("id", id)
        .select()
        .single()

    if (error) {
        console.error("Error toggling subtopic shelved status:", error)
        return { error: "Failed to update subtopic" }
    }

    revalidatePath("/admin/subtopics")
    return { data }
}

// Delete a subtopic (soft delete)
export async function deleteSubtopic(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("sub_topics").update({ is_deleted: true }).eq("id", id)

    if (error) {
        console.error("Error deleting subtopic:", error)
        return { error: "Failed to delete subtopic" }
    }

    revalidatePath("/admin/subtopics")
    return { success: true }
}

// Hard delete a subtopic (for admin purposes)
export async function hardDeleteSubtopic(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("sub_topics").delete().eq("id", id)

    if (error) {
        console.error("Error hard deleting subtopic:", error)
        return { error: "Failed to delete subtopic" }
    }

    revalidatePath("/admin/subtopics")
    return { success: true }
}
