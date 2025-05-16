"use client"

import { useState, useEffect } from "react"
import { useEffect as useReactEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Archive,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    CheckCircle,
    Layers3,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SubtopicDialog } from "@/components/subtopics/subtopic-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toggleSubtopicShelved } from "@/app/actions/subtopics"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SimpleSearchableDropdown } from "@/components/ui/simple-searchable-dropdown"
import { createClient } from "@/utils/supabase/client"
import type { Subject } from "@/lib/types"
import { CopyButton } from "@/components/ui/copy-button"

interface SubtopicsTableProps {
    data: any[]
    pageCount: number
    currentPage: number
    pageSize: number
    searchQuery: string
    topicId?: string
}

export function SubtopicsTable({ data, pageCount, currentPage, pageSize, searchQuery, topicId }: SubtopicsTableProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()
    const [search, setSearch] = useState(searchQuery)
    const debouncedSearch = useDebounce(search, 300) // 300ms debounce delay
    const [showShelved, setShowShelved] = useState(false)

    // Modal state
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: "create" | "edit" | "details"
        subtopic?: any
    }>({
        isOpen: false,
        mode: "create",
    })

    const [subjects, setSubjects] = useState<Subject[]>([])
    const [topics, setTopics] = useState<any[]>([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedTopic, setSelectedTopic] = useState(topicId || "")
    const [isLoadingFilters, setIsLoadingFilters] = useState(false)

    // Fetch subjects and topics for the filter dropdowns
    useReactEffect(() => {
        async function fetchFilters() {
            setIsLoadingFilters(true)
            const supabase = createClient()

            // Fetch subjects
            const { data: subjectsData, error: subjectsError } = await supabase
                .from("subjects")
                .select("id, name")
                .eq("is_deleted", false)
                .order("name")

            if (subjectsError) {
                console.error("Error fetching subjects:", subjectsError)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load subjects. Please try again.",
                })
            } else {
                setSubjects(subjectsData as Subject[])
            }

            // Fetch topics
            const topicsQuery = supabase
                .from("topics")
                .select("id, name, subject_id, subjects(name)")
                .eq("is_deleted", false)
                .order("name")

            // If a subject is selected, filter topics by that subject
            if (selectedSubject) {
                topicsQuery.eq("subject_id", selectedSubject)
            }

            const { data: topicsData, error: topicsError } = await topicsQuery

            if (topicsError) {
                console.error("Error fetching topics:", topicsError)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load topics. Please try again.",
                })
            } else {
                setTopics(topicsData)
            }

            setIsLoadingFilters(false)
        }

        fetchFilters()
    }, [toast, selectedSubject])

    // Handle subject filter change
    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        setSelectedTopic("") // Reset topic selection when subject changes

        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", "1") // Reset to first page
        params.set("per_page", pageSize.toString())
        if (showShelved) params.set("shelved", "true")
        router.push(`${pathname}?${params.toString()}`)
    }

    // Handle topic filter change
    const handleTopicChange = (value: string) => {
        setSelectedTopic(value)

        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", "1") // Reset to first page
        params.set("per_page", pageSize.toString())
        if (showShelved) params.set("shelved", "true")
        if (value) params.set("topic_id", value)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Update URL when debounced search changes
    useEffect(() => {
        if (debouncedSearch !== searchQuery) {
            const params = new URLSearchParams()
            if (debouncedSearch) params.set("search", debouncedSearch)
            params.set("page", "1") // Reset to first page on new search
            params.set("per_page", pageSize.toString())
            if (showShelved) params.set("shelved", "true")
            if (topicId) params.set("topic_id", topicId)
            router.push(`${pathname}?${params.toString()}`)
        }
    }, [debouncedSearch, searchQuery, pathname, router, pageSize, showShelved, topicId])

    // Handle pagination
    const handlePagination = (page: number) => {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", page.toString())
        params.set("per_page", pageSize.toString())
        if (showShelved) params.set("shelved", "true")
        if (topicId) params.set("topic_id", topicId)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Open dialog for create/edit/details
    const openDialog = (mode: "create" | "edit" | "details", subtopic?: any) => {
        setDialogState({
            isOpen: true,
            mode,
            subtopic,
        })
    }

    // Close dialog
    const closeDialog = () => {
        setDialogState((prev) => ({ ...prev, isOpen: false }))
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Toggle shelved status
    const handleToggleShelved = async (id: string, isShelved: boolean) => {
        try {
            const result = await toggleSubtopicShelved(id, isShelved)

            if (result.error) {
                throw new Error(result.error)
            }

            toast({
                title: isShelved ? "Subtopic shelved" : "Subtopic unshelved",
                description: isShelved
                    ? "The subtopic has been moved to the shelf."
                    : "The subtopic has been moved back to active subtopics.",
            })

            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update subtopic. Please try again.",
            })
        }
    }

    // Toggle show shelved subtopics
    const toggleShowShelved = () => {
        setShowShelved(!showShelved)
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", "1") // Reset to first page
        params.set("per_page", pageSize.toString())
        if (!showShelved) params.set("shelved", "true")
        if (topicId) params.set("topic_id", topicId)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Filter subtopics based on shelved status
    const filteredData = showShelved ? data : data.filter((subtopic) => !subtopic.is_shelved)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex flex-col md:flex-row gap-2 flex-1 w-full">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search subtopics..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <div className="w-full sm:w-[200px]">
                            <SimpleSearchableDropdown
                                options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
                                value={selectedSubject}
                                onValueChange={handleSubjectChange}
                                placeholder="Filter by Subject"
                                disabled={isLoadingFilters}
                                className="h-10"
                            />
                        </div>
                        <div className="w-full sm:w-[200px]">
                            <SimpleSearchableDropdown
                                options={topics.map((topic) => ({
                                    value: topic.id,
                                    label: selectedSubject ? topic.name : `${topic.name} (${topic.subjects?.name || "Unknown"})`,
                                }))}
                                value={selectedTopic}
                                onValueChange={handleTopicChange}
                                placeholder="Filter by Topic"
                                disabled={isLoadingFilters}
                                className="h-10"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={toggleShowShelved} className="gap-1.5 flex-1 sm:flex-none">
                        {showShelved ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Show Active Only
                            </>
                        ) : (
                            <>
                                <Archive className="h-4 w-4" />
                                Show Shelved
                            </>
                        )}
                    </Button>
                    <Button onClick={() => openDialog("create")} className="gap-1.5 flex-1 sm:flex-none">
                        <Plus className="h-4 w-4" />
                        Add Subtopic
                    </Button>
                </div>
            </div>

            {/* Desktop view */}
            <div className="rounded-2xl border shadow-sm overflow-hidden hidden md:block">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Topic</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Layers3 className="h-8 w-8 mb-2 opacity-40" />
                                        <p>No subtopics found</p>
                                        {!showShelved && (
                                            <Button variant="link" onClick={toggleShowShelved} className="mt-2">
                                                Show shelved subtopics
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((subtopic) => (
                                <TableRow
                                    key={subtopic.id}
                                    className={`hover:bg-muted/50 transition-colors ${subtopic.is_shelved ? "bg-muted/20" : ""}`}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2 group">
                                            <span>{subtopic.name}</span>
                                            <CopyButton
                                                value={`Sub Topic - ${subtopic.name}\nTopic - ${subtopic.topics?.name || "Unknown"}\nSubject - ${subtopic.topics?.subjects?.name || "Unknown"}${subtopic.description ? "\nDescription - " + subtopic.description : ""}`}
                                                tooltipMessage="Copy subtopic details"
                                            />
                                            {subtopic.is_shelved && (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    <Archive className="h-3 w-3 mr-1" /> Shelved
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 group">
                                            <span>{subtopic.topics?.name || "Unknown"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 group">
                                            <span>{subtopic.topics?.subjects?.name || "Unknown"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 group">
                                            {subtopic.description ? (
                                                <>
                                                    <span>
                                                        {subtopic.description.length > 50
                                                            ? `${subtopic.description.substring(0, 50)}...`
                                                            : subtopic.description}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground italic">No description</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={subtopic.is_active ? "success" : "destructive"}>
                                            {subtopic.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(subtopic.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDialog("details", subtopic)}
                                                            className="hover:bg-primary/10"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View details</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>View details</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDialog("edit", subtopic)}
                                                            className="hover:bg-primary/10"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Edit subtopic</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <DropdownMenu>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                    <span className="sr-only">More options</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                        </TooltipTrigger>
                                                        <TooltipContent>More options</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleToggleShelved(subtopic.id, !subtopic.is_shelved)}>
                                                        {subtopic.is_shelved ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Unshelve Subtopic
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Archive className="h-4 w-4 mr-2" />
                                                                Shelve Subtopic
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDialog("edit", subtopic)}>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Edit Subtopic
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view with accordions */}
            <div className="md:hidden space-y-2">
                {filteredData.length === 0 ? (
                    <div className="h-24 flex flex-col items-center justify-center text-muted-foreground rounded-2xl border">
                        <Layers3 className="h-8 w-8 mb-2 opacity-40" />
                        <p>No subtopics found</p>
                        {!showShelved && (
                            <Button variant="link" onClick={toggleShowShelved} className="mt-2">
                                Show shelved subtopics
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredData.map((subtopic) => (
                        <Accordion
                            type="single"
                            collapsible
                            key={subtopic.id}
                            className={`rounded-2xl border shadow-sm overflow-hidden ${subtopic.is_shelved ? "bg-muted/20" : ""}`}
                        >
                            <AccordionItem value="item-1" className="border-0">
                                <div className="flex items-center px-4 py-3">
                                    <AccordionTrigger className="flex-1 hover:no-underline">
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-2">
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
                                        </div>
                                    </AccordionTrigger>
                                    <div className="group ml-2">
                                        <CopyButton
                                            value={`Sub Topic - ${subtopic.name}\nTopic - ${subtopic.topics?.name || "Unknown"}\nSubject - ${subtopic.topics?.subjects?.name || "Unknown"}${subtopic.description ? "\nDescription - " + subtopic.description : ""}`}
                                            tooltipMessage="Copy subtopic details"
                                        />
                                    </div>
                                </div>
                                <AccordionContent className="px-4 pb-3 pt-0">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium">Topic</p>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm text-muted-foreground">{subtopic.topics?.name || "Unknown"}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Subject</p>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm text-muted-foreground">{subtopic.topics?.subjects?.name || "Unknown"}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Description</p>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm text-muted-foreground">
                                                    {subtopic.description || "No description provided"}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Created</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(subtopic.created_at)}</p>
                                        </div>
                                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleShelved(subtopic.id, !subtopic.is_shelved)}
                                                className="gap-1.5"
                                            >
                                                {subtopic.is_shelved ? (
                                                    <>
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Unshelve
                                                    </>
                                                ) : (
                                                    <>
                                                        <Archive className="h-3.5 w-3.5" />
                                                        Shelve
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDialog("details", subtopic)}
                                                className="gap-1.5"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDialog("edit", subtopic)}
                                                className="gap-1.5"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))
                )}
            </div>

            {pageCount > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {pageCount}
                    </div>
                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePagination(1)}
                                        disabled={currentPage === 1}
                                        className="rounded-xl"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>First page</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePagination(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="rounded-xl"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Previous page</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePagination(currentPage + 1)}
                                        disabled={currentPage === pageCount}
                                        className="rounded-xl"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Next page</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePagination(pageCount)}
                                        disabled={currentPage === pageCount}
                                        className="rounded-xl"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Last page</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            )}

            {/* Dialogs for create/edit/details */}
            <SubtopicDialog
                mode={dialogState.mode}
                subtopic={dialogState.subtopic}
                isOpen={dialogState.isOpen}
                onClose={closeDialog}
                topicId={topicId}
            />
        </div>
    )
}
