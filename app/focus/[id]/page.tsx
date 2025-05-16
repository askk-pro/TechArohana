"use client"

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ReaderSettings } from "@/components/reader-settings"

export const metadata: Metadata = {
    title: "Focus Mode - Interview Question",
    description: "Read technical questions in distraction-free mode",
}

export default async function FocusQuestionPage({ params }: { params: { id: string } }) {
    const supabase = createClient()

    const { data: question, error } = await supabase
        .from("interview_questions")
        .select("title, gist_url")
        .eq("id", params.id)
        .single()

    if (!question || error) return notFound()

    const res = await fetch(`https://gist.githubusercontent.com/${question.gist_url}/raw/question.md`)
    const markdown = await res.text()

    return (
        <div>
            <ReaderSettings />
            <div
                className="prose dark:prose-invert mx-auto px-4 py-8"
                style={{
                    fontSize: "var(--reader-font-size)",
                    lineHeight: "var(--reader-line-height)",
                    maxWidth: "var(--reader-width)"
                }}
            >
                <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
        </div>
    )
}
