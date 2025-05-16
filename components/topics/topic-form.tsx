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
import { createTopic, updateTopic } from "@/app/actions/topics"
import { topicSchema, type TopicFormValues } from "@/lib/schemas/topic-schema"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Archive, HelpCircle, Save, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"
import type { Subject } from "@/lib/types"

// Define the form schema type explicitly
type FormValues = TopicFormValues

interface TopicFormProps {
    topic?: any
    onSuccess?: () => void
    mode?: "create" | "edit" | "details"
    subjectId?: string
}

export function TopicForm({ topic, onSuccess, mode = "create", subjectId }: TopicFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const isMobile = useIsMobile()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

    // Fetch subjects for the dropdown
    useEffect(() => {
        async function fetchSubjects() {
            setIsLoadingSubjects(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from("subjects")
                .select("id, name")
                .eq("is_deleted", false)
                .eq("is_active", true)
                .order("name")

            if (error) {
                console.error("Error fetching subjects:", error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load subjects. Please try again.",
                })
            } else {
                setSubjects(data as Subject[])
            }
            setIsLoadingSubjects(false)
        }

        fetchSubjects()
    }, [toast])

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(topicSchema) as any, // Use type assertion to bypass type checking
        defaultValues: {
            name: topic?.name || "",
            description: topic?.description || "",
            subject_id: topic?.subject_id || subjectId || "",
            is_active: topic?.is_active ?? true, // Use nullish coalescing to ensure boolean
            is_shelved: topic?.is_shelved ?? false, // Default to not shelved
        },
    })

    const isReadOnly = mode === "details"

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsLoading(true)

        try {
            if (mode === "edit" && topic?.id) {
                // Update existing topic
                const result = await updateTopic(topic.id, values)

                if (result.error) {
                    throw new Error(typeof result.error === "string" ? result.error : "Failed to update topic")
                }

                toast({
                    title: "Topic updated",
                    description: "The topic has been updated successfully.",
                })
            } else if (mode === "create") {
                // Create new topic
                const result = await createTopic(values)

                if (result.error) {
                    throw new Error(typeof result.error === "string" ? result.error : "Failed to create topic")
                }

                toast({
                    title: "Topic created",
                    description: "The new topic has been created successfully.",
                })
            }

            // Refresh the page data
            router.refresh()

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Error saving topic:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "There was a problem saving the topic. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

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
                                    <Input placeholder="Enter topic name" {...field} disabled={isReadOnly} className="rounded-xl" />
                                </FormControl>
                                <FormDescription>The name of the topic.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subject_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Subject</FormLabel>
                                <Select
                                    disabled={isReadOnly || isLoadingSubjects || !!subjectId}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder={isLoadingSubjects ? "Loading subjects..." : "Select a subject"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>The subject this topic belongs to.</FormDescription>
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
                                <FormDescription>A brief description of the topic.</FormDescription>
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
                                                        Active topics are visible to users and can be associated with subtopics and questions.
                                                        Inactive topics are hidden from users but preserved in the database.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormDescription>
                                            Determine whether this topic is active and visible in the application.
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
                                                        Shelved topics are hidden from the main view but can be accessed when needed. This helps
                                                        declutter your workspace without deleting valuable content.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormDescription>Move this topic to the shelf to hide it from the main view.</FormDescription>
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
                    <Button type="button" variant="outline" onClick={onSuccess} className="gap-1.5 rounded-xl">
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || isReadOnly} className="gap-1.5 rounded-xl">
                        {isLoading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {mode === "edit" ? "Save Changes" : "Save Topic"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
