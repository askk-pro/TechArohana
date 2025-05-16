"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Pencil, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Subject } from "@/lib/types"
import { SubjectDialog } from "@/components/subjects/subject-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"

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
            router.push(`${pathname}?${params.toString()}`)
        }
    }, [debouncedSearch, searchQuery, pathname, router, pageSize])

    // Handle pagination
    const handlePagination = (page: number) => {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("page", page.toString())
        params.set("per_page", pageSize.toString())
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search subjects..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => openDialog("create")}>Add Subject</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No subjects found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {subject.description ? (
                                            subject.description.length > 50 ? (
                                                `${subject.description.substring(0, 50)}...`
                                            ) : (
                                                subject.description
                                            )
                                        ) : (
                                            <span className="text-muted-foreground italic">No description</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={subject.is_active ? "success" : "destructive"}>
                                            {subject.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {new Date(subject.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog("details", subject)}>
                                                <span className="sr-only">View details</span>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openDialog("edit", subject)}>
                                                <span className="sr-only">Edit</span>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pageCount > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {pageCount}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handlePagination(1)} disabled={currentPage === 1}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePagination(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePagination(currentPage + 1)}
                            disabled={currentPage === pageCount}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePagination(pageCount)}
                            disabled={currentPage === pageCount}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

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
