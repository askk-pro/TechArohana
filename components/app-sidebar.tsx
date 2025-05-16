"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    BookOpen,
    Code,
    Database,
    FileQuestion,
    Home,
    Layers,
    Plus,
    Search,
    Settings,
    Sparkles,
    ChevronDown,
    ChevronsUp,
    ChevronsDown,
    Layers3,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createClient } from "@/utils/supabase/client"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Subject } from "@/lib/types"

export function AppSidebar() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})
    const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({})
    const [searchTerm, setSearchTerm] = useState("")
    const [showShelved, setShowShelved] = useState(false)

    const supabase = createClient()

    const toggleSubject = (id: string, e?: React.MouseEvent) => {
        // If event exists, stop propagation to prevent navigation when clicking the chevron
        if (e) {
            e.stopPropagation()
        }
        setOpenSubjects((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const toggleTopic = (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation()
        }
        setOpenTopics((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    // Function to collapse all subjects
    const collapseAll = () => {
        setOpenSubjects({})
        setOpenTopics({})
    }

    // Function to expand all subjects
    const expandAll = () => {
        const allSubjectsOpen: Record<string, boolean> = {}
        const allTopicsOpen: Record<string, boolean> = {}

        subjects.forEach((subject) => {
            allSubjectsOpen[subject.id] = true
            subject.topics?.forEach((topic) => {
                allTopicsOpen[topic.id] = true
            })
        })

        setOpenSubjects(allSubjectsOpen)
        setOpenTopics(allTopicsOpen)
    }

    useEffect(() => {
        async function loadSubjects() {
            const { data, error } = await supabase
                .from("subjects")
                .select(`id, name, is_shelved, topics (id, name, subtopics:sub_topics (id, name))`)
            if (!error && data) {
                setSubjects(data as Subject[])
            }
        }
        loadSubjects()
    }, [])

    const filtered = (s: Subject) => s.name.toLowerCase().includes(searchTerm.toLowerCase())

    const renderSubjectItem = (subject: Subject) => (
        <Collapsible
            key={subject.id}
            open={openSubjects[subject.id]}
            onOpenChange={() => toggleSubject(subject.id)}
            className="w-full"
        >
            <SidebarMenuItem>
                <div className="flex w-full items-center">
                    <Link
                        href={`/admin/subjects/${subject.id}`}
                        className="flex-1 flex items-center py-2 px-3 rounded-md hover:bg-accent"
                    >
                        <Layers className="h-4 w-4 mr-2" />
                        <span className="truncate">{subject.name}</span>
                    </Link>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => toggleSubject(subject.id, e)}
                                    >
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${openSubjects[subject.id] ? "rotate-180" : ""}`}
                                        />
                                        <span className="sr-only">Toggle topics</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {openSubjects[subject.id] ? "Collapse topics" : "Expand topics"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </SidebarMenuItem>
            <CollapsibleContent>
                {subject.topics?.map((topic) => (
                    <Collapsible
                        key={topic.id}
                        open={openTopics[topic.id]}
                        onOpenChange={() => toggleTopic(topic.id)}
                        className="ml-4 mt-1"
                    >
                        <SidebarMenuItem>
                            <div className="flex w-full items-center">
                                <Link
                                    href={`/admin/topics/${topic.id}`}
                                    className="flex-1 flex items-center py-1.5 px-3 rounded-md hover:bg-accent"
                                >
                                    <Code className="h-3.5 w-3.5 mr-2" />
                                    <span className="truncate">{topic.name}</span>
                                </Link>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={(e) => toggleTopic(topic.id, e)}
                                                >
                                                    <ChevronDown
                                                        className={`h-3.5 w-3.5 transition-transform ${openTopics[topic.id] ? "rotate-180" : ""}`}
                                                    />
                                                    <span className="sr-only">Toggle subtopics</span>
                                                </Button>
                                            </CollapsibleTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {openTopics[topic.id] ? "Collapse subtopics" : "Expand subtopics"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </SidebarMenuItem>
                        <CollapsibleContent>
                            {topic.subtopics?.map((subtopic) => (
                                <SidebarMenuItem key={subtopic.id}>
                                    <Link
                                        href={`/admin/subtopics/${subtopic.id}`}
                                        className="ml-4 flex items-center py-1.5 px-3 rounded-md hover:bg-accent w-full"
                                    >
                                        <Layers3 className="h-3 w-3 mr-2" />
                                        <span className="truncate">{subtopic.name}</span>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </CollapsibleContent>
        </Collapsible>
    )

    return (
        <Sidebar className="hidden md:flex">
            <SidebarHeader className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold tracking-tight">TechArohana</h1>
                </div>
                <div className="mt-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <SidebarInput
                            placeholder="Search subjects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/random-question">
                                    <FileQuestion className="h-4 w-4" />
                                    <span>Random Question</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/glossary">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Topic Glossary</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <div className="flex items-center justify-between px-3 py-1.5">
                        <SidebarGroupLabel className="mb-0">Subjects</SidebarGroupLabel>
                        <div className="flex gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={expandAll}>
                                            <ChevronsDown className="h-4 w-4" />
                                            <span className="sr-only">Expand all</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Expand all</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={collapseAll}>
                                            <ChevronsUp className="h-4 w-4" />
                                            <span className="sr-only">Collapse all</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Collapse all</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu>{subjects.filter((s) => !s.is_shelved && filtered(s)).map(renderSubjectItem)}</SidebarMenu>

                        {subjects.some((s) => s.is_shelved) && (
                            <>
                                <SidebarGroupLabel className="mt-4 flex justify-between items-center">
                                    <span>Shelved Subjects</span>
                                    <Switch checked={showShelved} onCheckedChange={setShowShelved} />
                                </SidebarGroupLabel>
                                {showShelved && (
                                    <SidebarMenu>
                                        {subjects.filter((s) => s.is_shelved && filtered(s)).map(renderSubjectItem)}
                                    </SidebarMenu>
                                )}
                            </>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/admin/subjects">
                                        <Layers className="h-4 w-4" />
                                        <span>Manage Subjects</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/admin/topics">
                                        <Code className="h-4 w-4" />
                                        <span>Manage Topics</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/admin/subtopics">
                                        <Layers3 className="h-4 w-4" />
                                        <span>Manage Subtopics</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/admin/questions">
                                        <Database className="h-4 w-4" />
                                        <span>Manage Questions</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/admin/settings">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/add-question">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                        </Link>
                    </Button>
                    <ModeToggle />
                </div>
            </SidebarFooter>

            <SidebarRail />
            <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
        </Sidebar>
    )
}
