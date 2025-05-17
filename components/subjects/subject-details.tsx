"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, Calendar, CheckCircle, Code, Edit, Eye, Layers3, XCircle, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SubjectDialog } from "@/components/subjects/subject-dialog"
import { CopyButton } from "@/components/ui/copy-button"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getSubjectCounts } from "@/app/actions/subjects"

interface SubjectDetailsProps {
    subject: any
}

export function SubjectDetails({ subject }: SubjectDetailsProps) {
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: "edit" | "details"
    }>({
        isOpen: false,
        mode: "details",
    })
    const { toast } = useToast()
    const [counts, setCounts] = useState({ topicCount: 0, subtopicCount: 0 })
    const [isLoadingCounts, setIsLoadingCounts] = useState(false)

    // Fetch topic and subtopic counts on component mount
    useEffect(() => {
        const fetchCounts = async () => {
            if (subject?.id) {
                setIsLoadingCounts(true)
                try {
                    const result = await getSubjectCounts(subject.id)
                    if (!result.error) {
                        setCounts({
                            topicCount: result.topicCount ?? 0,
                            subtopicCount: result.subtopicCount ?? 0,
                        })
                    }
                } catch (error) {
                    console.error("Error fetching counts:", error)
                } finally {
                    setIsLoadingCounts(false)
                }
            }
        }

        fetchCounts()
    }, [subject])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Format relative time (e.g., "2 days ago")
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "just now"

        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

        const diffInMonths = Math.floor(diffInDays / 30)
        if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`

        const diffInYears = Math.floor(diffInMonths / 12)
        return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
    }

    const handleCopy = () => {
        toast({
            title: "Copied to clipboard",
            description: "Subject details have been copied to clipboard",
        })
    }

    return (
        <>
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="topics">Topics ({isLoadingCounts ? "..." : counts.topicCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">Subject Information</CardTitle>
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
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="group relative">
                                                    <CopyButton
                                                        value={`Subject - ${subject.name}\nDescription - ${subject.description || "N/A"}`}
                                                        onCopied={handleCopy}
                                                        className="opacity-100"
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>Copy subject details</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            <CardDescription>Details about the subject</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Summary section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-muted/30">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Badge variant={subject.is_active ? "success" : "destructive"} className="mb-2">
                                            {subject.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/30">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <div className="text-xl font-bold mb-1">{isLoadingCounts ? "..." : counts.topicCount}</div>
                                        <p className="text-sm text-muted-foreground">Topics</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/30">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <div className="text-xl font-bold mb-1">{isLoadingCounts ? "..." : counts.subtopicCount}</div>
                                        <p className="text-sm text-muted-foreground">Subtopics</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/30">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{formatRelativeTime(subject.modified_at)}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Last Updated</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                    <p className="text-base font-medium">{subject.name}</p>
                                    <Separator className="my-2" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                    <p className="text-base">{subject.description || "No description provided"}</p>
                                    <Separator className="my-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                        <div className="flex items-center gap-2">
                                            {subject.is_active ? (
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
                                            {subject.is_shelved ? (
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
                                            <div>
                                                <div>{formatDate(subject.created_at)}</div>
                                                <div className="text-xs text-muted-foreground">{formatRelativeTime(subject.created_at)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div>{formatDate(subject.modified_at)}</div>
                                                <div className="text-xs text-muted-foreground">{formatRelativeTime(subject.modified_at)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-end">
                            <Button asChild variant="outline" size="sm" className="gap-1.5">
                                <Link href={`/admin/topics?subject_id=${subject.id}`}>
                                    <Layers3 className="h-4 w-4" />
                                    Manage Topics
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="topics" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle>Topics in this Subject</CardTitle>
                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                                        <Link href={`/admin/topics?subject_id=${subject.id}`}>
                                            <Eye className="h-4 w-4" />
                                            View All
                                        </Link>
                                    </Button>
                                    <Button asChild variant="default" size="sm" className="gap-1.5">
                                        <Link href={`/admin/topics/new?subject_id=${subject.id}`}>
                                            <Code className="h-4 w-4" />
                                            Add Topic
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>Topics associated with {subject.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {subject.topics && subject.topics.length > 0 ? (
                                <div className="grid gap-3">
                                    {subject.topics.map((topic: any) => (
                                        <Link
                                            key={topic.id}
                                            href={`/admin/topics/${topic.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Code className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{topic.name}</span>
                                                {topic.is_shelved && (
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        <Archive className="h-3 w-3 mr-1" /> Shelved
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={topic.is_active ? "success" : "destructive"}>
                                                    {topic.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                                {topic.subtopics_count !== undefined && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Layers3 className="h-3 w-3" />
                                                        {topic.subtopics_count} subtopics
                                                    </Badge>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p>No topics found for this subject.</p>
                                    <Button asChild variant="link" className="mt-2">
                                        <Link href={`/admin/topics/new?subject_id=${subject.id}`}>Add a topic</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <SubjectDialog
                mode={dialogState.mode}
                subject={subject}
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState({ ...dialogState, isOpen: false })}
            />
        </>
    )
}
