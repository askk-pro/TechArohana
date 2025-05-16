import { getSubtopicById } from "@/app/actions/subtopics"
import { SubtopicDetails } from "@/components/subtopics/subtopic-details"
import { notFound } from "next/navigation"

export default async function SubtopicPage({ params }: { params: { id: string } }) {
    try {
        const subtopic = await getSubtopicById(params.id)

        if (!subtopic) {
            return notFound()
        }

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{subtopic.name}</h1>
                    <p className="text-muted-foreground">Subtopic details and related questions</p>
                </div>

                <SubtopicDetails subtopic={subtopic} />
            </div>
        )
    } catch (error) {
        console.error("Error loading subtopic:", error)
        return notFound()
    }
}
