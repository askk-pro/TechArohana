"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { subjectSchema } from "@/lib/schemas/subject-schema"

// Get all subjects with pagination and search
export async function getSubjects({
    page = 1,
    pageSize = 10,
    search = "",
    showShelved = false,
}: {
    page?: number
    pageSize?: number
    search?: string
    showShelved?: boolean
}) {
    const supabase = await createClient()

    // Calculate the range for Supabase query
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build the query
    let query = supabase
        .from("subjects")
        .select("*, topics:topics(count)", { count: "exact" })
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

    // Execute the query
    const { data, count, error } = await query

    if (error) {
        console.error("Error fetching subjects:", error)
        throw new Error("Failed to fetch subjects")
    }

    return {
        data,
        count,
        pageCount: count ? Math.ceil(count / pageSize) : 0,
    }
}

// Get a single subject by ID with related topics and subtopic counts
export async function getSubjectById(id: string) {
    const supabase = await createClient()

    // First get the subject with its topics
    const { data: subject, error: subjectError } = await supabase
        .from("subjects")
        .select(`
      *,
      topics:topics(
        id, 
        name, 
        is_active, 
        is_shelved
      )
    `)
        .eq("id", id)
        .eq("is_deleted", false)
        .single()

    if (subjectError) {
        console.error("Error fetching subject:", subjectError)
        throw new Error("Failed to fetch subject")
    }

    // If we have topics, get the subtopic counts for each topic
    if (subject && subject.topics && subject.topics.length > 0) {
        // Get all topic IDs
        const topicIds = subject.topics.map((topic: any) => topic.id)

        // Get subtopic counts for each topic individually
        const subtopicCounts = []
        const countMap: Record<string, number> = {}

        // Create a map of topic_id to count
        for (const topicId of topicIds) {
            const { count, error } = await supabase
                .from("sub_topics")
                .select("*", { count: "exact" })
                .eq("topic_id", topicId)
                .eq("is_deleted", false)

            if (!error && count !== null) {
                countMap[topicId] = count
                subtopicCounts.push({ topic_id: topicId, count })
            }
        }

        // Add the subtopic count to each topic
        subject.topics = subject.topics.map((topic: any) => ({
            ...topic,
            subtopics_count: countMap[topic.id] || 0,
        }))
    }

    // Get total topic count
    const { count: topicCount, error: topicCountError } = await supabase
        .from("topics")
        .select("*", { count: "exact" })
        .eq("subject_id", id)
        .eq("is_deleted", false)

    if (!topicCountError) {
        subject.topic_count = topicCount
    }

    // First get all topic IDs for this subject
    const { data: topicIdsData, error: topicIdsError } = await supabase
        .from("topics")
        .select("id")
        .eq("subject_id", id)
        .eq("is_deleted", false)

    let subtopicCount = 0
    let subtopicCountError = null

    if (!topicIdsError && topicIdsData) {
        // Extract the topic IDs
        const subjectTopicIds = topicIdsData.map((topic) => topic.id)

        // If we have topic IDs, count the subtopics
        if (subjectTopicIds.length > 0) {
            const { count, error } = await supabase
                .from("sub_topics")
                .select("*", { count: "exact" })
                .in("topic_id", subjectTopicIds)
                .eq("is_deleted", false)

            subtopicCount = count || 0
            subtopicCountError = error
        }
    }

    if (!subtopicCountError) {
        subject.subtopic_count = subtopicCount
    }

    return subject
}

// Create a new subject
export async function createSubject(formData: any) {
    const supabase = await createClient()

    // Validate the form data
    const result = subjectSchema.safeParse(formData)

    if (!result.success) {
        return { error: result.error.format() }
    }

    const { data, error } = await supabase.from("subjects").insert(result.data).select().single()

    if (error) {
        console.error("Error creating subject:", error)
        return { error: "Failed to create subject" }
    }

    revalidatePath("/admin/subjects")
    return { data }
}

// Update an existing subject
export async function updateSubject(id: string, formData: any) {
    const supabase = await createClient()

    // Validate the form data
    const result = subjectSchema.safeParse(formData)

    if (!result.success) {
        return { error: result.error.format() }
    }

    const { data, error } = await supabase.from("subjects").update(result.data).eq("id", id).select().single()

    if (error) {
        console.error("Error updating subject:", error)
        return { error: "Failed to update subject" }
    }

    revalidatePath("/admin/subjects")
    revalidatePath(`/admin/subjects/${id}`)
    return { data }
}

// Toggle shelved status
export async function toggleSubjectShelved(id: string, isShelved: boolean) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("subjects")
        .update({ is_shelved: isShelved })
        .eq("id", id)
        .select()
        .single()

    if (error) {
        console.error("Error toggling subject shelved status:", error)
        return { error: "Failed to update subject" }
    }

    revalidatePath("/admin/subjects")
    return { data }
}

// Delete a subject (soft delete)
export async function deleteSubject(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("subjects").update({ is_deleted: true }).eq("id", id)

    if (error) {
        console.error("Error deleting subject:", error)
        return { error: "Failed to delete subject" }
    }

    revalidatePath("/admin/subjects")
    return { success: true }
}

// Hard delete a subject (for admin purposes)
export async function hardDeleteSubject(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("subjects").delete().eq("id", id)

    if (error) {
        console.error("Error hard deleting subject:", error)
        return { error: "Failed to delete subject" }
    }

    revalidatePath("/admin/subjects")
    return { success: true }
}

// Get topic and subtopic counts for a subject
export async function getSubjectCounts(id: string) {
    const supabase = await createClient()

    // Get topic count
    const { count: topicCount, error: topicError } = await supabase
        .from("topics")
        .select("*", { count: "exact" })
        .eq("subject_id", id)
        .eq("is_deleted", false)

    if (topicError) {
        console.error("Error fetching topic count:", topicError)
        return { error: "Failed to fetch topic count" }
    }

    // First get all topic IDs for this subject
    const { data: topicIdsData, error: topicIdsError } = await supabase
        .from("topics")
        .select("id")
        .eq("subject_id", id)
        .eq("is_deleted", false)

    let subtopicCount = 0
    let subtopicError = null

    if (!topicIdsError && topicIdsData) {
        // Extract the topic IDs
        const subjectTopicIds = topicIdsData.map((topic) => topic.id)

        // If we have topic IDs, count the subtopics
        if (subjectTopicIds.length > 0) {
            const { count, error } = await supabase
                .from("sub_topics")
                .select("*", { count: "exact" })
                .in("topic_id", subjectTopicIds)
                .eq("is_deleted", false)

            subtopicCount = count || 0
            subtopicError = error
        }
    }

    if (subtopicError) {
        console.error("Error fetching subtopic count:", subtopicError)
        return { error: "Failed to fetch subtopic count" }
    }

    return {
        topicCount: topicCount || 0,
        subtopicCount: subtopicCount || 0,
    }
}
