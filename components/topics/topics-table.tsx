"use client"

import { useState, useEffect } from "react"
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
    Layers,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TopicDialog } from "@/components/topics/topic-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toggleTopicShelved } from "@/app/actions/topics"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Add these imports at the top
import { useEffect as useReactEffect } from "react"
import { SimpleSearchableDropdown } from "@/components/ui/simple-searchable-dropdown"
import { createClient } from "@/utils/supabase/client"
import type { Subject } from "@/lib/types"
import { CopyButton } from "@/components/ui/copy-button"

interface TopicsTableProps {
    data: any[]
    pageCount: number
    currentPage: number
    pageSize: number
    searchQuery: string
    subjectId?: string
}

export function TopicsTable({ data, pageCount, currentPage, pageSize, searchQuery, subjectId }: TopicsTableProps) {
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
        topic?: any
    }>({
        isOpen: false,
        mode: "create",
    })

    // Add this inside the TopicsTable component, after the existing state declarations
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedSubject, setSelectedSubject] = useState(subjectId || "")
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

    // Fetch subjects for the filter dropdown
    useReactEffect(() => {
        async function fetchSubjects() {
            setIsLoadingSubjects(true)
            const supabase = createClient()
            const { data, error } = await supabase.from("subjects").select("id, name").eq("is_deleted", false).order("name")

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

    // Handle subject filter change
    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", "1") // Reset to first page
        params.set("per_page", pageSize.toString())
        if (showShelved) params.set("shelved", "true")
        if (value) params.set("subject_id", value)
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
            if (subjectId) params.set("subject_id", subjectId)
            router.push(`${pathname}?${params.toString()}`)
        }
    }, [debouncedSearch, searchQuery, pathname, router, pageSize, showShelved, subjectId])

    // Handle pagination
    const handlePagination = (page: number) => {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", page.toString())
        params.set("per_page", pageSize.toString())
        if (showShelved) params.set("shelved", "true")
        if (subjectId) params.set("subject_id", subjectId)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Open dialog for create/edit/details
    const openDialog = (mode: "create" | "edit" | "details", topic?: any) => {
        setDialogState({
            isOpen: true,
            mode,
            topic,
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
            const result = await toggleTopicShelved(id, isShelved)

            if (result.error) {
                throw new Error(result.error)
            }

            toast({
                title: isShelved ? "Topic shelved" : "Topic unshelved",
                description: isShelved
                    ? "The topic has been moved to the shelf."
                    : "The topic has been moved back to active topics.",
            })

            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update topic. Please try again.",
            })
        }
    }

    // Toggle show shelved topics
    const toggleShowShelved = () => {
        setShowShelved(!showShelved)
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", "1") // Reset to first page
        params.set("per_page", pageSize.toString())
        if (!showShelved) params.set("shelved", "true")
        if (subjectId) params.set("subject_id", subjectId)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Filter topics based on shelved status
    const filteredData = showShelved ? data : data.filter((topic) => !topic.is_shelved)

    return (
        <div className="space-y-4">
            {/* Replace the existing search input div with this updated version that includes the subject filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex flex-col md:flex-row gap-2 flex-1 w-full">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search topics..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-[250px]">
                        <SimpleSearchableDropdown
                            options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
                            value={selectedSubject}
                            onValueChange={handleSubjectChange}
                            placeholder="Filter by Subject"
                            disabled={isLoadingSubjects}
                            className="h-10 rounded-md"
                        />
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
                        Add Topic
                    </Button>
                </div>
            </div>

            {/* Desktop view */}
            <div className="rounded-2xl border shadow-sm overflow-hidden hidden md:block">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                            <TableHead>Name</TableHead>
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
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Layers className="h-8 w-8 mb-2 opacity-40" />
                                        <p>No topics found</p>
                                        {!showShelved && (
                                            <Button variant="link" onClick={toggleShowShelved} className="mt-2">
                                                Show shelved topics
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((topic) => (
                                <TableRow
                                    key={topic.id}
                                    className={`hover:bg-muted/50 transition-colors ${topic.is_shelved ? "bg-muted/20" : ""}`}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2 group">
                                            {topic.name}
                                            <CopyButton
                                                value={`Topic - ${topic.name}\nSubject - ${topic.subjects?.name || "Unknown"}\nDescription - ${topic.description || "N/A"}`}
                                                tooltipMessage="Copy topic details"
                                            />
                                            {topic.is_shelved && (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    <Archive className="h-3 w-3 mr-1" /> Shelved
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 group">{topic.subjects?.name || "Unknown"}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 group">
                                            {topic.description ? (
                                                <>
                                                    {topic.description.length > 50
                                                        ? `${topic.description.substring(0, 50)}...`
                                                        : topic.description}
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground italic">No description</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={topic.is_active ? "success" : "destructive"}>
                                            {topic.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(topic.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDialog("details", topic)}
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
                                                            onClick={() => openDialog("edit", topic)}
                                                            className="hover:bg-primary/10"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Edit topic</TooltipContent>
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
                                                    <DropdownMenuItem onClick={() => handleToggleShelved(topic.id, !topic.is_shelved)}>
                                                        {topic.is_shelved ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Unshelve Topic
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Archive className="h-4 w-4 mr-2" />
                                                                Shelve Topic
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/subtopics?topic_id=${topic.id}`}>
                                                            <Layers className="h-4 w-4 mr-2" />
                                                            Manage Subtopics
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDialog("edit", topic)}>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Edit Topic
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
                        <Layers className="h-8 w-8 mb-2 opacity-40" />
                        <p>No topics found</p>
                        {!showShelved && (
                            <Button variant="link" onClick={toggleShowShelved} className="mt-2">
                                Show shelved topics
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredData.map((topic) => (
                        <Accordion
                            type="single"
                            collapsible
                            key={topic.id}
                            className={`rounded-2xl border shadow-sm overflow-hidden ${topic.is_shelved ? "bg-muted/20" : ""}`}
                        >
                            <AccordionItem value="item-1" className="border-0">
                                <div className="flex items-center px-4 py-3">
                                    <AccordionTrigger className="flex-1 hover:no-underline">
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{topic.name}</span>
                                                {topic.is_shelved && (
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        <Archive className="h-3 w-3 mr-1" /> Shelved
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge variant={topic.is_active ? "success" : "destructive"}>
                                                {topic.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <div className="group ml-2">
                                        <CopyButton
                                            value={`Topic - ${topic.name}\nSubject - ${topic.subjects?.name || "Unknown"}\nDescription - ${topic.description || "N/A"}`}
                                            tooltipMessage="Copy topic details"
                                        />
                                    </div>
                                </div>
                                <AccordionContent className="px-4 pb-3 pt-0">
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm font-medium">Subject</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{topic.subjects?.name || "Unknown"}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm font-medium">Description</p>
                                                {topic.description && (
                                                    <CopyButton value={topic.description} tooltipMessage="Copy description" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{topic.description || "No description provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Created</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(topic.created_at)}</p>
                                        </div>
                                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleShelved(topic.id, !topic.is_shelved)}
                                                className="gap-1.5"
                                            >
                                                {topic.is_shelved ? (
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
                                            <Button variant="outline" size="sm" asChild className="gap-1.5">
                                                <Link href={`/admin/subtopics?topic_id=${topic.id}`}>
                                                    <Layers className="h-3.5 w-3.5" />
                                                    Subtopics
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDialog("details", topic)}
                                                className="gap-1.5"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => openDialog("edit", topic)} className="gap-1.5">
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
            <TopicDialog
                mode={dialogState.mode}
                topic={dialogState.topic}
                isOpen={dialogState.isOpen}
                onClose={closeDialog}
                subjectId={subjectId}
            />
        </div>
    )
}
