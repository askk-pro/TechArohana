// Add Subject type to your existing types file
export interface Subject {
    id: string
    name: string
    description: string | null
    is_active: boolean
    is_deleted: boolean
    created_at: string
    modified_at: string
}

// Existing Location type (for reference)
export interface Location {
    id: string
    name: string
    type: string
    address: string | null
    postal_code: string | null
    country: string
    created_at: string
    updated_at: string
}
