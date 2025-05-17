"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SubjectForm } from "@/components/subjects/subject-form"
import type { Subject } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Calendar, CheckCircle, Trash2, XCircle, BookOpen, Layers3 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteSubject, getSubjectCounts } from "@/app/actions/subjects"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface SubjectDialogProps {
    mode: "create" | "edit" | "details"
    subject?: Subject
    isOpen: boolean
    onClose: () => void
    dialogTitle?: string
}

export function SubjectDialog({ mode, subject, isOpen, onClose, dialogTitle }: SubjectDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [counts, setCounts] = useState({ topicCount: 0, subtopicCount: 0 })
    const [isLoadingCounts, setIsLoadingCounts] = useState(false)

    // Fetch topic and subtopic counts when dialog opens in details mode
    useEffect(() => {
        const fetchCounts = async () => {
            if (isOpen && mode === "details" && subject) {
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
    }, [isOpen, mode, subject])

    const handleDelete = async () => {
        if (!subject) return

        setIsLoading(true)

        try {
            // Use soft delete by default
            const result = await deleteSubject(subject.id)

            if (result.error) {
                throw new Error(result.error)
            }

            toast({
                title: "Success",
                description: "Subject deleted successfully.",
            })
            router.refresh()
            onClose()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete subject. Please try again.",
            })
        } finally {
            setIsLoading(false)
            setShowDeleteConfirm(false)
        }
    }

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

    // Generate a consistent emoji based on the subject name
    const getSubjectEmoji = (name: string) => {
        const emojiList = ["📚", "🧠", "💻", "🔍", "🧮", "🧪", "📊", "📝", "🔬", "🧩"]
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return emojiList[hash % emojiList.length]
    }

    const renderContent = () => {
        if (mode === "details" && subject) {
            return (
                <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                {getSubjectEmoji(subject.name)}
                            </div>
                            <div>
                                <CardTitle className="text-2xl tracking-tight">{subject.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={subject.is_active ? "success" : "destructive"}>
                                        {subject.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                    {subject.is_shelved && (
                                        <Badge variant="outline" className="text-muted-foreground">
                                            <Archive className="h-3 w-3 mr-1" /> Shelved
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {isLoadingCounts ? "..." : counts.topicCount} topics
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Layers3 className="h-3 w-3" />
                                        {isLoadingCounts ? "..." : counts.subtopicCount} subtopics
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 space-y-6">
                        <div className="grid gap-4">
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

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={onClose} className="rounded-xl">
                                Close
                            </Button>
                            <Button variant="outline" onClick={() => openDialog("edit", subject)} className="rounded-xl gap-1.5">
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isLoading}
                                className="gap-1.5 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return <SubjectForm subject={subject} onSuccess={onClose} mode={mode} />
    }

    const titles = {
        create: dialogTitle || "Add New Subject",
        edit: dialogTitle || "Edit Subject",
        details: dialogTitle || "Subject Details",
    }

    const openDialog = (mode: "edit", subject: Subject) => {
        onClose()
        setTimeout(() => {
            setDialogState({
                isOpen: true,
                mode,
                subject,
            })
        }, 100)
    }

    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: "create" | "edit" | "details"
        subject?: Subject
    }>({
        isOpen: false,
        mode: "create",
    })

    // Close dialog when ESC is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !showDeleteConfirm) {
                onClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, showDeleteConfirm, onClose])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{titles[mode]}</DialogTitle>
                    </DialogHeader>
                    {renderContent()}
                </DialogContent>
            </Dialog>

            <Dialog
                open={dialogState.isOpen}
                onOpenChange={(open) => !open && setDialogState({ ...dialogState, isOpen: false })}
            >
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{titles[dialogState.mode]}</DialogTitle>
                    </DialogHeader>
                    <SubjectForm
                        subject={dialogState.subject}
                        onSuccess={() => setDialogState({ ...dialogState, isOpen: false })}
                        mode={dialogState.mode}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this subject?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the subject "{subject?.name}" and remove it
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-1.5"
                        >
                            <Trash2 className="h-4 w-4" />
                            {isLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
