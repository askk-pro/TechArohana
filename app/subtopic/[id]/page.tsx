import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { QuestionCard } from "@/components/question-card"
import type { Metadata } from "next"

type PageProps = {
    params: {
        id: string
    }
}

export default function SubtopicPage({ params }: PageProps) {
    // Mock data for a subtopic
    const subtopic = {
        id: params.id,
        name: "Closures",
        description: "Understanding JavaScript closures and their practical applications",
        parentTopic: "Advanced JS",
        parentSubject: "JavaScript",
    }

    // Mock questions for this subtopic
    const questions = [
        {
            title: "Explain closures in JavaScript",
            difficulty: "Medium",
            tags: ["JavaScript", "Functions", "Scope"],
            isTopQuestion: true,
            isRead: true,
            isUnderstood: true,
            knowsAnswer: false,
            isConfident: false,
            isImportant: true,
            priority: 8,
        },
        {
            title: "Create a private counter using closures",
            difficulty: "Medium",
            tags: ["JavaScript", "Closures", "Practical"],
            isTopQuestion: false,
            isRead: true,
            isUnderstood: true,
            knowsAnswer: true,
            isConfident: false,
            isImportant: false,
            priority: 6,
        },
        {
            title: "Implement a memoization function using closures",
            difficulty: "Hard",
            tags: ["JavaScript", "Closures", "Performance"],
            isTopQuestion: true,
            isRead: false,
            isUnderstood: false,
            knowsAnswer: false,
            isConfident: false,
            isImportant: true,
            priority: 9,
        },
        {
            title: "Explain closure memory leaks",
            difficulty: "Hard",
            tags: ["JavaScript", "Closures", "Memory Management"],
            isTopQuestion: false,
            isRead: false,
            isUnderstood: false,
            knowsAnswer: false,
            isConfident: false,
            isImportant: false,
            priority: 7,
        },
    ]

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="mb-6 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{subtopic.name}</h1>
                        <Badge variant="outline">{subtopic.parentTopic}</Badge>
                        <Badge variant="outline">{subtopic.parentSubject}</Badge>
                    </div>
                    <p className="text-muted-foreground">{subtopic.description}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {questions.map((question, index) => (
                    <QuestionCard
                        key={index}
                        title={question.title}
                        difficulty={question.difficulty as "Easy" | "Medium" | "Hard"}
                        tags={question.tags}
                        isTopQuestion={question.isTopQuestion}
                        isRead={question.isRead}
                        isUnderstood={question.isUnderstood}
                        knowsAnswer={question.knowsAnswer}
                        isConfident={question.isConfident}
                        isImportant={question.isImportant}
                        priority={question.priority}
                    />
                ))}
            </div>
        </div>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `Subtopic: ${params.id}`,
        description: "View questions for this subtopic",
    }
}
