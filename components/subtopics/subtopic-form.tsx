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
import { createSubtopic, updateSubtopic } from "@/app/actions/subtopics"
import { subtopicSchema, type SubtopicFormValues } from "@/lib/schemas/subtopic-schema"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Archive, HelpCircle, Save, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"

// Define the form schema type explicitly
type FormValues = SubtopicFormValues

interface SubtopicFormProps {
    subtopic?: any
    onSuccess?: () => void
    mode?: "create" | "edit" | "details"
    topicId?: string
}

export function SubtopicForm({ subtopic, onSuccess, mode = "create", topicId }: SubtopicFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const isMobile = useIsMobile()
    const [topics, setTopics] = useState<any[]>([])
    const [isLoadingTopics, setIsLoadingTopics] = useState(false)

    // Fetch topics for the dropdown
    useEffect(() => {
        async function fetchTopics() {
            setIsLoadingTopics(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from("topics")
                .select("id, name, subject_id, subjects(name)")
                .eq("is_deleted", false)
                .eq("is_active", true)
                .order("name")

            if (error) {
                console.error("Error fetching topics:", error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load topics. Please try again.",
                })
            } else {
                setTopics(data)
            }
            setIsLoadingTopics(false)
        }

        fetchTopics()
    }, [toast])

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(subtopicSchema) as any, // Use type assertion to bypass type checking
        defaultValues: {
            name: subtopic?.name || "",
            description: subtopic?.description || "",
            topic_id: subtopic?.topic_id || topicId || "",
            is_active: subtopic?.is_active ?? true, // Use nullish coalescing to ensure boolean
            is_shelved: subtopic?.is_shelved ?? false, // Default to not shelved
        },
    })

    const isReadOnly = mode === "details"

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsLoading(true)

        try {
            if (mode === "edit" && subtopic?.id) {
                // Update existing subtopic
                const result = await updateSubtopic(subtopic.id, values)

                if (result.error) {
                    throw new Error(typeof result.error === "string" ? result.error : "Failed to update subtopic")
                }

                toast({
                    title: "Subtopic updated",
                    description: "The subtopic has been updated successfully.",
                })
            } else if (mode === "create") {
                // Create new subtopic
                const result = await createSubtopic(values)

                if (result.error) {
                    throw new Error(typeof result.error === "string" ? result.error : "Failed to create subtopic")
                }

                toast({
                    title: "Subtopic created",
                    description: "The new subtopic has been created successfully.",
                })
            }

            // Refresh the page data
            router.refresh()

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Error saving subtopic:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    error instanceof Error ? error.message : "There was a problem saving the subtopic. Please try again.",
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
                                    <Input placeholder="Enter subtopic name" {...field} disabled={isReadOnly} className="rounded-xl" />
                                </FormControl>
                                <FormDescription>The name of the subtopic.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="topic_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">Topic</FormLabel>
                                <Select
                                    disabled={isReadOnly || isLoadingTopics || !!topicId}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder={isLoadingTopics ? "Loading topics..." : "Select a topic"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {topics.map((topic) => (
                                            <SelectItem key={topic.id} value={topic.id}>
                                                {topic.name} ({topic.subjects?.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>The topic this subtopic belongs to.</FormDescription>
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
                                <FormDescription>A brief description of the subtopic.</FormDescription>
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
                                                        Active subtopics are visible to users and can be associated with questions. Inactive
                                                        subtopics are hidden from users but preserved in the database.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormDescription>
                                            Determine whether this subtopic is active and visible in the application.
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
                                                        Shelved subtopics are hidden from the main view but can be accessed when needed. This helps
                                                        declutter your workspace without deleting valuable content.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormDescription>Move this subtopic to the shelf to hide it from the main view.</FormDescription>
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
                                {mode === "edit" ? "Save Changes" : "Save Subtopic"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
