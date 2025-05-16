"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SubjectForm } from "@/components/subjects/subject-form"
import type { Subject } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, CheckCircle, XCircle } from "lucide-react"
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
import { deleteSubject } from "@/app/actions/subjects"

interface SubjectDialogProps {
    mode: "create" | "edit" | "details"
    subject?: Subject
    isOpen: boolean
    onClose: () => void
}

export function SubjectDialog({ mode, subject, isOpen, onClose }: SubjectDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

    const renderContent = () => {
        if (mode === "details" && subject) {
            return (
                <Card className="border-0 shadow-none">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl">{subject.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-4">
                        <div className="grid gap-4">
                            <div className="flex items-start space-x-3">
                                <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">Description</p>
                                    <p className="text-muted-foreground">{subject.description || "No description provided"}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                {subject.is_active ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                )}
                                <div>
                                    <p className="font-medium">Status</p>
                                    <p className="text-muted-foreground">{subject.is_active ? "Active" : "Inactive"}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">Created</p>
                                    <p className="text-muted-foreground">{formatDate(subject.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">Last Updated</p>
                                    <p className="text-muted-foreground">{formatDate(subject.modified_at)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isLoading}>
                                {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return <SubjectForm subject={subject} onSuccess={onClose} mode={mode} />
    }

    const title = {
        create: "Add New Subject",
        edit: "Edit Subject",
        details: "Subject Details",
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{title[mode]}</DialogTitle>
                    </DialogHeader>
                    {renderContent()}
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this subject?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the subject "{subject?.name}" and remove it
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
