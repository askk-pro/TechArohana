"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Subject } from "@/lib/types"
import { createSubject, updateSubject } from "@/app/actions/subjects"
import { subjectSchema, type SubjectFormValues } from "@/lib/schemas/subject-schema"

// Define the form schema type explicitly
type FormValues = SubjectFormValues

interface SubjectFormProps {
    subject?: Partial<Subject>
    onSuccess?: () => void
    mode?: "create" | "edit" | "details"
}

export function SubjectForm({ subject, onSuccess, mode = "create" }: SubjectFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(subjectSchema) as any, // Use type assertion to bypass type checking
        defaultValues: {
            name: subject?.name || "",
            description: subject?.description || "",
            is_active: subject?.is_active ?? true, // Use nullish coalescing to ensure boolean
        },
    })

    const isReadOnly = mode === "details"

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsLoading(true)

        try {
            if (mode === "edit" && subject?.id) {
                // Update existing subject
                const result = await updateSubject(subject.id, values)

                if (result.error) {
                    throw new Error(typeof result.error === "string" ? result.error : "Failed to update subject")
                }

                toast({
                    title: "Subject updated",
                    description: "The subject has been updated successfully.",
                })
            } else if (mode === "create") {
                // Create new subject
                const result = await createSubject(values)

                if (result.error) {
                    throw new Error(typeof result.error === "string" ? result.error : "Failed to create subject")
                }

                toast({
                    title: "Subject created",
                    description: "The new subject has been created successfully.",
                })
            }

            // Refresh the page data
            router.refresh()

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Error saving subject:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    error instanceof Error ? error.message : "There was a problem saving the subject. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter subject name" {...field} disabled={isReadOnly} />
                            </FormControl>
                            <FormDescription>The name of the subject.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter description (optional)"
                                    className="min-h-[100px]"
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isReadOnly}
                                />
                            </FormControl>
                            <FormDescription>A brief description of the subject.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Status</FormLabel>
                                <FormDescription>
                                    Determine whether this subject is active and visible in the application.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isReadOnly}
                                    aria-readonly={isReadOnly}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || isReadOnly}>
                        {isLoading ? "Saving..." : mode === "edit" ? "Update Subject" : "Create Subject"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
