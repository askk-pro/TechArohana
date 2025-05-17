"use client"

import { useState, useEffect } from "react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Archive, HelpCircle, Save, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Separator } from "@/components/ui/separator"
import { useHotkeys } from "react-hotkeys-hook"

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
    const isMobile = useIsMobile()

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(subjectSchema) as any, // Use type assertion to bypass type checking
        defaultValues: {
            name: subject?.name || "",
            description: subject?.description || "",
            is_active: subject?.is_active ?? true, // Use nullish coalescing to ensure boolean
            is_shelved: subject?.is_shelved ?? false, // Default to not shelved
        },
    })

    const isReadOnly = mode === "details"

    // Add keyboard shortcuts
    useHotkeys(
        "ctrl+s, cmd+s",
        (event) => {
            event.preventDefault()
            if (!isReadOnly && !isLoading) {
                form.handleSubmit(onSubmit)()
            }
        },
        { enableOnFormTags: true },
        [form, isLoading, isReadOnly],
    )

    useHotkeys(
        "esc",
        () => {
            if (onSuccess) onSuccess()
        },
        [onSuccess],
    )

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

    // Focus the name field on mount
    useEffect(() => {
        if (mode !== "details") {
            setTimeout(() => {
                form.setFocus("name")
            }, 100)
        }
    }, [form, mode])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className={isMobile ? "space-y-6" : "grid grid-cols-1 xl:grid-cols-2 gap-6"}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter subject name"
                                        {...field}
                                        disabled={isReadOnly}
                                        className="rounded-xl"
                                        aria-required="true"
                                    />
                                </FormControl>
                                <FormDescription>
                                    The name of the subject. This will be displayed in the subject list and used for navigation.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="xl:row-span-2">
                                <FormLabel className="text-base">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter description (optional)"
                                        className="min-h-[120px] rounded-xl"
                                        {...field}
                                        value={field.value || ""}
                                        disabled={isReadOnly}
                                    />
                                </FormControl>
                                <FormDescription>
                                    A brief description of the subject. This helps users understand what topics are covered in this
                                    subject.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <FormLabel className="text-base m-0">Active Status</FormLabel>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-[300px]">
                                                        Active subjects are visible to users and can be associated with topics and questions.
                                                        Inactive subjects are hidden from users but preserved in the database.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
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

                        <FormField
                            control={form.control}
                            name="is_shelved"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <FormLabel className="text-base m-0">Shelved Status</FormLabel>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-[300px]">
                                                        Shelved subjects are hidden from the main view but can be accessed when needed. This helps
                                                        declutter your workspace without deleting valuable content.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormDescription>Move this subject to the shelf to hide it from the main view.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            {field.value && <Archive className="h-4 w-4 text-muted-foreground" />}
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isReadOnly}
                                                aria-readonly={isReadOnly}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                <div className="flex gap-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onSuccess}
                        className="gap-1.5 rounded-xl"
                        aria-label="Cancel"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || isReadOnly}
                        className="gap-1.5 rounded-xl"
                        aria-label={mode === "edit" ? "Save Changes" : "Save Subject"}
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {mode === "edit" ? "Save Changes" : "Save Subject"}
                            </>
                        )}
                    </Button>
                </div>

                {!isMobile && (
                    <div className="text-xs text-muted-foreground text-right mt-2">
                        <kbd className="px-1.5 py-0.5 border rounded text-xs">Ctrl</kbd> +{" "}
                        <kbd className="px-1.5 py-0.5 border rounded text-xs">S</kbd> to save •
                        <kbd className="px-1.5 py-0.5 border rounded text-xs ml-2">Esc</kbd> to cancel
                    </div>
                )}
            </form>
        </Form>
    )
}
