// Add Subject type to your existing types file
export interface Subject {
    id: string
    name: string
    description: string | null
    is_active: boolean
    is_shelved: boolean
    is_deleted: boolean
    created_at: string
    modified_at: string
    topics?: Topic[]
}

export interface Topic {
    id: string
    name: string
    subject_id: string
    subtopics: SubTopic[]
}

export interface SubTopic {
    id: string
    name: string
    topic_id: string
}
