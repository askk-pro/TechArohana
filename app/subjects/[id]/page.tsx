import { getSubjectById } from "@/app/actions/subjects"
import { SubjectDetails } from "@/components/subjects/subject-details"
import { notFound } from "next/navigation"

export default async function SubjectPage({ params }: { params: { id: string } }) {
    try {
        const subject = await getSubjectById(params.id)

        if (!subject) {
            return notFound()
        }

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
                    <p className="text-muted-foreground">Subject details and related topics</p>
                </div>

                <SubjectDetails subject={subject} />
            </div>
        )
    } catch (error) {
        console.error("Error loading subject:", error)
        return notFound()
    }
}
