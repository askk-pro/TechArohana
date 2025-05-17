"use client"

import { useState, useEffect, useRef } from "react"
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
    BookOpen,
    CheckCircle,
    Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Subject } from "@/lib/types"
import { SubjectDialog } from "@/components/subjects/subject-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toggleSubjectShelved } from "@/app/actions/subjects"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CopyButton } from "@/components/ui/copy-button"
import Link from "next/link"

interface SubjectsTableProps {
    data: Subject[]
    pageCount: number
    currentPage: number
    pageSize: number
    searchQuery: string
}

export function SubjectsTable({ data, pageCount, currentPage, pageSize, searchQuery }: SubjectsTableProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()
    const [search, setSearch] = useState(searchQuery)
    const debouncedSearch = useDebounce(search, 300) // 300ms debounce delay
    const [showShelved, setShowShelved] = useState(false)
    const [subjects, setSubjects] = useState<Subject[]>(data)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Update local state when props change
    useEffect(() => {
        setSubjects(data)
    }, [data])

    // Modal state
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        mode: "create" | "edit" | "details"
        subject?: Subject
    }>({
        isOpen: false,
        mode: "create",
    })

    // Update URL when debounced search changes
    useEffect(() => {
        if (debouncedSearch !== searchQuery) {
            const params = new URLSearchParams()
            if (debouncedSearch) params.set("search", debouncedSearch)
            params.set("page", "1") // Reset to first page on new search
            params.set("per_page", pageSize.toString())
            if (showShelved) params.set("shelved", "true")
            router.push(`${pathname}?${params.toString()}`)
        }
    }, [debouncedSearch, searchQuery, pathname, router, pageSize, showShelved])

    // Handle pagination
    const handlePagination = (page: number) => {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", page.toString())
        params.set("per_page", pageSize.toString())
        if (showShelved) params.set("shelved", "true")
        router.push(`${pathname}?${params.toString()}`)
    }

    // Open dialog for create/edit/details
    const openDialog = (mode: "create" | "edit" | "details", subject?: Subject) => {
        setDialogState({
            isOpen: true,
            mode,
            subject,
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

    // Format relative time (e.g., "2 days ago")
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "just now"

        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours}h ago`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) return `${diffInDays}d ago`

        const diffInMonths = Math.floor(diffInDays / 30)
        if (diffInMonths < 12) return `${diffInMonths}mo ago`

        const diffInYears = Math.floor(diffInMonths / 12)
        return `${diffInYears}y ago`
    }

    // Toggle shelved status with optimistic updates
    const handleToggleShelved = async (id: string, isShelved: boolean) => {
        try {
            // Optimistic update
            const optimisticData = [...subjects]
            const subjectIndex = optimisticData.findIndex((s) => s.id === id)

            if (subjectIndex !== -1) {
                optimisticData[subjectIndex] = {
                    ...optimisticData[subjectIndex],
                    is_shelved: isShelved,
                }
                setSubjects(optimisticData)
            }

            // Actual API call
            const result = await toggleSubjectShelved(id, isShelved)

            if (result.error) {
                // Revert optimistic update on error
                setSubjects(data)
                throw new Error(result.error)
            }

            toast({
                title: isShelved ? "Subject shelved" : "Subject unshelved",
                description: isShelved
                    ? "The subject has been moved to the shelf."
                    : "The subject has been moved back to active subjects.",
            })

            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update subject. Please try again.",
            })
        }
    }

    // Toggle show shelved subjects
    const toggleShowShelved = () => {
        setShowShelved(!showShelved)
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", "1") // Reset to first page
        params.set("per_page", pageSize.toString())
        if (!showShelved) params.set("shelved", "true")
        router.push(`${pathname}?${params.toString()}`)
    }

    // Filter subjects based on shelved status
    const filteredData = showShelved ? subjects : subjects.filter((subject) => !subject.is_shelved)

    // Add keyboard event listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if no input or textarea is focused
            const activeElement = document.activeElement
            const isInputFocused =
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement ||
                (activeElement && activeElement.getAttribute("contenteditable") === "true")

            // Handle 'n' key for new subject
            if (e.key === "n" && !isInputFocused) {
                e.preventDefault()
                openDialog("create")
            }

            // Handle '/' key for search focus
            if (e.key === "/" && !isInputFocused) {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        ref={searchInputRef}
                        type="search"
                        placeholder="Search subjects..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search subjects"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleShowShelved}
                        className="gap-1.5 flex-1 sm:flex-none"
                        aria-label={showShelved ? "Show active subjects only" : "Show shelved subjects"}
                    >
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
                    <Button
                        onClick={() => openDialog("create")}
                        className="gap-1.5 flex-1 sm:flex-none"
                        aria-label="Add new subject"
                    >
                        <Plus className="h-4 w-4" />
                        Add Subject
                    </Button>
                </div>
            </div>

            {/* Desktop view */}
            <div className="rounded-2xl border shadow-sm overflow-hidden hidden md:block">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                            <TableHead className="w-[30%]">Name</TableHead>
                            <TableHead className="w-[40%]">Description</TableHead>
                            <TableHead className="w-[15%]">Status</TableHead>
                            <TableHead className="w-[15%]">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <BookOpen className="h-8 w-8 mb-2 opacity-40" />
                                        <p>No subjects found</p>
                                        {!showShelved && (
                                            <Button variant="link" onClick={toggleShowShelved} className="mt-2">
                                                Show shelved subjects
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((subject) => (
                                <TableRow
                                    key={subject.id}
                                    className={`hover:bg-muted/50 transition-colors ${subject.is_shelved ? "bg-muted/20" : ""}`}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2 group">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="truncate max-w-[200px]">{subject.name}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{subject.name}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <CopyButton
                                                value={`Subject - ${subject.name}\nDescription - ${subject.description || "N/A"}`}
                                                tooltipMessage="Copy subject details"
                                            />
                                            {subject.is_shelved && (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    <Archive className="h-3 w-3 mr-1" /> Shelved
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 group">
                                            {subject.description ? (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="truncate max-w-[300px]">{subject.description}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-[300px]">{subject.description}</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-muted-foreground italic">No description</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={subject.is_active ? "success" : "destructive"}>
                                            {subject.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{formatDate(subject.created_at)}</span>
                                            <span className="text-xs text-muted-foreground flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatRelativeTime(subject.created_at)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDialog("details", subject)}
                                                            className="hover:bg-primary/10"
                                                            aria-label="View subject details"
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
                                                            onClick={() => openDialog("edit", subject)}
                                                            className="hover:bg-primary/10"
                                                            aria-label="Edit subject"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Edit subject</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <DropdownMenu>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="hover:bg-primary/10"
                                                                    aria-label="More options"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                    <span className="sr-only">More options</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                        </TooltipTrigger>
                                                        <TooltipContent>More options</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleToggleShelved(subject.id, !subject.is_shelved)}>
                                                        {subject.is_shelved ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Unshelve Subject
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Archive className="h-4 w-4 mr-2" />
                                                                Shelve Subject
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/topics?subject_id=${subject.id}`}>
                                                            <BookOpen className="h-4 w-4 mr-2" />
                                                            Manage Topics
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDialog("edit", subject)}>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Edit Subject
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
                        <BookOpen className="h-8 w-8 mb-2 opacity-40" />
                        <p>No subjects found</p>
                        {!showShelved && (
                            <Button variant="link" onClick={toggleShowShelved} className="mt-2">
                                Show shelved subjects
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredData.map((subject) => (
                        <Accordion
                            type="single"
                            collapsible
                            key={subject.id}
                            className={`rounded-2xl border shadow-sm overflow-hidden ${subject.is_shelved ? "bg-muted/20" : ""}`}
                        >
                            <AccordionItem value="item-1" className="border-0">
                                <div className="flex items-center px-4 py-3">
                                    <AccordionTrigger className="flex-1 hover:no-underline">
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium truncate max-w-[150px]">{subject.name}</span>
                                                {subject.is_shelved && (
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        <Archive className="h-3 w-3 mr-1" /> Shelved
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge variant={subject.is_active ? "success" : "destructive"}>
                                                {subject.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <div className="group ml-2">
                                        <CopyButton
                                            value={`Subject - ${subject.name}\nDescription - ${subject.description || "N/A"}`}
                                            tooltipMessage="Copy subject details"
                                        />
                                    </div>
                                </div>
                                <AccordionContent className="px-4 pb-3 pt-0">
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm font-medium">Description</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {subject.description || "No description provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Created</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-sm text-muted-foreground">{formatDate(subject.created_at)}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    ({formatRelativeTime(subject.created_at)})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleShelved(subject.id, !subject.is_shelved)}
                                                className="gap-1.5"
                                            >
                                                {subject.is_shelved ? (
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
                                                <Link href={`/admin/topics?subject_id=${subject.id}`}>
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                    Topics
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDialog("details", subject)}
                                                className="gap-1.5"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDialog("edit", subject)}
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
                                        aria-label="First page"
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
                                        aria-label="Previous page"
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
                                        aria-label="Next page"
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
                                        aria-label="Last page"
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

            {/* Keyboard shortcuts help */}
            <div className="text-xs text-muted-foreground text-right mt-2 hidden md:block">
                Press <kbd className="px-1.5 py-0.5 border rounded text-xs">N</kbd> to add a new subject •
                <kbd className="px-1.5 py-0.5 border rounded text-xs ml-2">/</kbd> to search
            </div>

            {/* Dialogs for create/edit/details */}
            <SubjectDialog
                mode={dialogState.mode}
                subject={dialogState.subject}
                isOpen={dialogState.isOpen}
                onClose={closeDialog}
            />
        </div>
    )
}
