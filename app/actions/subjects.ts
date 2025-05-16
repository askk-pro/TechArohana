"use server"

import { subjectSchema } from "@/lib/schemas/subject-schema"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Remove type exports from this file

// Get all subjects with pagination and search
export async function getSubjects({
    page = 1,
    pageSize = 10,
    search = "",
}: {
    page?: number
    pageSize?: number
    search?: string
}) {
    const supabase = await createClient()

    // Calculate the range for Supabase query
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Build the query
    let query = supabase
        .from("subjects")
        .select("*", { count: "exact" })
        .eq("is_deleted", false)
        .range(from, to)
        .order("created_at", { ascending: false })

    // Add search if provided
    if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
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

// Get a single subject by ID
export async function getSubjectById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("subjects").select("*").eq("id", id).eq("is_deleted", false).single()

    if (error) {
        console.error("Error fetching subject:", error)
        throw new Error("Failed to fetch subject")
    }

    return data
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
