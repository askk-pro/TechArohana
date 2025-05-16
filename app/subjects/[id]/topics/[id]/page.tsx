import { getTopicById } from "@/app/actions/topics"
import { TopicDetails } from "@/components/topics/topic-details"
import { notFound } from "next/navigation"

export default async function TopicPage({ params }: { params: { id: string } }) {
    try {
        const topic = await getTopicById(params.id)

        if (!topic) {
            return notFound()
        }

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
                    <p className="text-muted-foreground">Topic details and related subtopics</p>
                </div>

                <TopicDetails topic={topic} />
            </div>
        )
    } catch (error) {
        console.error("Error loading topic:", error)
        return notFound()
    }
}
