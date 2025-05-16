"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TopicForm } from "@/components/topics/topic-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Calendar, CheckCircle, Trash2, XCircle } from "lucide-react"
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
import { deleteTopic } from "@/app/actions/topics"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface TopicDialogProps {
    mode: "create" | "edit" | "details"
    topic?: any
    isOpen: boolean
    onClose: () => void
    subjectId?: string
}

export function TopicDialog({ mode, topic, isOpen, onClose, subjectId }: TopicDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDelete = async () => {
        if (!topic) return

        setIsLoading(true)

        try {
            // Use soft delete by default
            const result = await deleteTopic(topic.id)

            if (result.error) {
                throw new Error(result.error)
            }

            toast({
                title: "Success",
                description: "Topic deleted successfully.",
            })
            router.refresh()
            onClose()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete topic. Please try again.",
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

    // Generate a consistent emoji based on the topic name
    const getTopicEmoji = (name: string) => {
        const emojiList = ["📚", "🧠", "💻", "🔍", "🧮", "🧪", "📊", "📝", "🔬", "🧩"]
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return emojiList[hash % emojiList.length]
    }

    const renderContent = () => {
        if (mode === "details" && topic) {
            return (
                <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                {getTopicEmoji(topic.name)}
                            </div>
                            <div>
                                <CardTitle className="text-2xl tracking-tight">{topic.name}</CardTitle>
                                {topic.is_shelved && (
                                    <Badge variant="outline" className="text-muted-foreground mt-1">
                                        <Archive className="h-3 w-3 mr-1" /> Shelved
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                                <p className="text-base font-medium">{topic.subjects?.name || "Unknown Subject"}</p>
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

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={onClose} className="rounded-xl">
                                Close
                            </Button>
                            <Button variant="outline" onClick={() => openDialog("edit", topic)} className="rounded-xl gap-1.5">
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

        return <TopicForm topic={topic} onSuccess={onClose} mode={mode} subjectId={subjectId} />
    }

    const title = {
        create: "Add New Topic",
        edit: "Edit Topic",
        details: "Topic Details",
    }

    const openDialog = (mode: "edit", topic: any) => {
        onClose()
        setTimeout(() => {
            setDialogState({
                isOpen: true,
                mode,
                topic,
            })
        }, 100)
    }

    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: "create" | "edit" | "details"
        topic?: any
    }>({
        isOpen: false,
        mode: "create",
    })

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{title[mode]}</DialogTitle>
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
                        <DialogTitle className="text-xl">{title[dialogState.mode]}</DialogTitle>
                    </DialogHeader>
                    <TopicForm
                        topic={dialogState.topic}
                        onSuccess={() => setDialogState({ ...dialogState, isOpen: false })}
                        mode={dialogState.mode}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this topic?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the topic "{topic?.name}" and remove it from
                            our servers.
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
