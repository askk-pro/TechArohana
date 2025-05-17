"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, Calendar, CheckCircle, Code, Edit, FileQuestion, Layers, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SubtopicDialog } from "@/components/subtopics/subtopic-dialog"
import { CopyButton } from "@/components/ui/copy-button"
import { useToast } from "@/hooks/use-toast"

interface SubtopicDetailsProps {
    subtopic: any
}

export function SubtopicDetails({ subtopic }: SubtopicDetailsProps) {
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: "edit" | "details"
    }>({
        isOpen: false,
        mode: "details",
    })
    const { toast } = useToast()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const handleCopy = () => {
        toast({
            title: "Copied to clipboard",
            description: "Subtopic details have been copied to clipboard",
        })
    }

    return (
        <>
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">Subtopic Information</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => setDialogState({ isOpen: true, mode: "edit" })}
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <div className="group relative">
                                        <CopyButton
                                            value={`Sub Topic - ${subtopic.name}\nTopic - ${subtopic.topics?.name || "Unknown"}\nSubject - ${subtopic.topics?.subjects?.name || "Unknown"}${subtopic.description ? "\nDescription - " + subtopic.description : ""}`}
                                            onCopied={handleCopy}
                                            className="opacity-100"
                                        />
                                    </div>
                                </div>
                            </div>
                            <CardDescription>Details about the subtopic</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                    <p className="text-base font-medium">{subtopic.name}</p>
                                    <Separator className="my-2" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Topic</h3>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/subjects/${subtopic.topics?.subject_id}/topics/${subtopic.topic_id}`}
                                            className="text-base font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Code className="h-4 w-4" />
                                            {subtopic.topics?.name || "Unknown Topic"}
                                        </Link>
                                    </div>
                                    <Separator className="my-2" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/subjects/${subtopic.topics?.subject_id}`}
                                            className="text-base font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Layers className="h-4 w-4" />
                                            {subtopic.topics?.subjects?.name || "Unknown Subject"}
                                        </Link>
                                    </div>
                                    <Separator className="my-2" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                    <p className="text-base">{subtopic.description || "No description provided"}</p>
                                    <Separator className="my-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                        <div className="flex items-center gap-2">
                                            {subtopic.is_active ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span>Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                    <span>Inactive</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Shelved</h3>
                                        <div className="flex items-center gap-2">
                                            {subtopic.is_shelved ? (
                                                <>
                                                    <Archive className="h-5 w-5 text-amber-500" />
                                                    <span>Shelved</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span>Not Shelved</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <span>{formatDate(subtopic.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <span>{formatDate(subtopic.modified_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle>Questions in this Subtopic</CardTitle>
                                <Button asChild variant="outline" size="sm" className="gap-1.5">
                                    <Link
                                        href={`/subjects/${subtopic.topics?.subject_id}/topics/${subtopic.topic_id}/subtopics/${subtopic.id}/questions`}
                                    >
                                        <FileQuestion className="h-4 w-4" />
                                        View All Questions
                                    </Link>
                                </Button>
                            </div>
                            <CardDescription>Questions associated with {subtopic.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {subtopic.questions && subtopic.questions.length > 0 ? (
                                <div className="grid gap-3">
                                    {subtopic.questions.map((question: any) => (
                                        <Link
                                            key={question.id}
                                            href={`/admin/questions/${question.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {question.title || question.question.substring(0, 60) + "..."}
                                                </span>
                                            </div>
                                            <Badge variant={question.is_active ? "success" : "destructive"}>
                                                {question.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p>No questions found for this subtopic.</p>
                                    <Button asChild variant="link" className="mt-2">
                                        <Link
                                            href={`/subjects/${subtopic.topics?.subject_id}/topics/${subtopic.topic_id}/subtopics/${subtopic.id}/questions/new`}
                                        >
                                            Add a question
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <SubtopicDialog
                mode={dialogState.mode}
                subtopic={subtopic}
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState({ ...dialogState, isOpen: false })}
            />
        </>
    )
}
