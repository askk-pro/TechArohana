"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, Calendar, CheckCircle, Edit, Eye, Layers, Layers3, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { TopicDialog } from "@/components/topics/topic-dialog"
import { CopyButton } from "@/components/ui/copy-button"
import { useToast } from "@/hooks/use-toast"

interface TopicDetailsProps {
    topic: any
}

export function TopicDetails({ topic }: TopicDetailsProps) {
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
            description: "Topic details have been copied to clipboard",
        })
    }

    return (
        <>
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="subtopics">Subtopics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">Topic Information</CardTitle>
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
                                            value={`Topic - ${topic.name}\nSubject - ${topic.subjects?.name || "Unknown"}\nDescription - ${topic.description || "N/A"}`}
                                            onCopied={handleCopy}
                                            className="opacity-100"
                                        />
                                    </div>
                                </div>
                            </div>
                            <CardDescription>Details about the topic</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                    <p className="text-base font-medium">{topic.name}</p>
                                    <Separator className="my-2" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/subjects/${topic.subject_id}`}
                                            className="text-base font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Layers className="h-4 w-4" />
                                            {topic.subjects?.name || "Unknown Subject"}
                                        </Link>
                                    </div>
                                    <Separator className="my-2" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                    <p className="text-base">{topic.description || "No description provided"}</p>
                                    <Separator className="my-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                        <div className="flex items-center gap-2">
                                            {topic.is_active ? (
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
                                            {topic.is_shelved ? (
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
                                            <span>{formatDate(topic.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <span>{formatDate(topic.modified_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subtopics" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle>Subtopics in this Topic</CardTitle>
                                <Button asChild variant="outline" size="sm" className="gap-1.5">
                                    <Link href={`/admin/subtopics?topic_id=${topic.id}`}>
                                        <Eye className="h-4 w-4" />
                                        View All
                                    </Link>
                                </Button>
                            </div>
                            <CardDescription>Subtopics associated with {topic.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topic.subtopics && topic.subtopics.length > 0 ? (
                                <div className="grid gap-3">
                                    {topic.subtopics.map((subtopic: any) => (
                                        <Link
                                            key={subtopic.id}
                                            href={`/admin/subtopics/${subtopic.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Layers3 className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{subtopic.name}</span>
                                                {subtopic.is_shelved && (
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        <Archive className="h-3 w-3 mr-1" /> Shelved
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge variant={subtopic.is_active ? "success" : "destructive"}>
                                                {subtopic.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p>No subtopics found for this topic.</p>
                                    <Button asChild variant="link" className="mt-2">
                                        <Link href={`/admin/subtopics/new?topic_id=${topic.id}`}>Add a subtopic</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <TopicDialog
                mode={dialogState.mode}
                topic={topic}
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState({ ...dialogState, isOpen: false })}
            />
        </>
    )
}
