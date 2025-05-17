"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    BookOpen, Code, Database, FileQuestion, Home, Layers, Plus,
    Search, Settings, Sparkles, ChevronDown, ChevronUp, LayoutPanelTop
} from "lucide-react"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem, SidebarRail, SidebarTrigger
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createClient } from "@/utils/supabase/client"
import { Switch } from "@/components/ui/switch"
import { Subject } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AppSidebar() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})
    const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({})
    const [searchTerm, setSearchTerm] = useState("")
    const [showShelved, setShowShelved] = useState(false)
    const [subjectsVisible, setSubjectsVisible] = useState(true)

    const supabase = createClient()

    const toggleSubject = (id: string) => {
        const newState = { ...openSubjects, [id]: !openSubjects[id] }
        setOpenSubjects(newState)
        localStorage.setItem("openSubjects", JSON.stringify(newState))
    }

    const toggleTopic = (id: string) => {
        const newState = { ...openTopics, [id]: !openTopics[id] }
        setOpenTopics(newState)
        localStorage.setItem("openTopics", JSON.stringify(newState))
    }

    const toggleSubjectsVisibility = () => {
        setSubjectsVisible(prev => !prev)
        localStorage.setItem("subjectsVisible", JSON.stringify(!subjectsVisible))
        // Clear openTopics when collapsing all
        if (!subjectsVisible) {
            setOpenTopics({})
            localStorage.removeItem("openTopics")
        }
    }

    useEffect(() => {
        async function loadSubjects() {
            const { data, error } = await supabase
                .from("subjects")
                .select("id, name, is_shelved, topics (id, name, subtopics:sub_topics (id, name))")
            if (!error && data) {
                setSubjects(data as Subject[])
            }
        }

        const storedSubjects = localStorage.getItem("openSubjects")
        const storedTopics = localStorage.getItem("openTopics")
        const storedVisible = localStorage.getItem("subjectsVisible")
        if (storedSubjects) setOpenSubjects(JSON.parse(storedSubjects))
        if (storedTopics) setOpenTopics(JSON.parse(storedTopics))
        if (storedVisible) setSubjectsVisible(JSON.parse(storedVisible))

        loadSubjects()
    }, [])

    const filtered = (s: Subject) => s.name.toLowerCase().includes(searchTerm.toLowerCase())

    const renderSubjectItem = (subject: Subject) => (
        <Collapsible
            key={subject.id}
            open={openSubjects[subject.id] ?? true}
            onOpenChange={() => toggleSubject(subject.id)}
            className="w-full"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        <span>{subject.name}</span>
                        <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform ${openSubjects[subject.id] ? "rotate-180" : ""}`}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
                {subject.topics?.map((topic) => (
                    <Collapsible
                        key={topic.id}
                        open={openTopics[topic.id] ?? false}
                        onOpenChange={() => toggleTopic(topic.id)}
                        className="ml-4 mt-1"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton asChild size="sm">
                                    <Link href={`/topic/${topic.id}`} className="flex items-center gap-1 w-full">
                                        <Code className="h-3.5 w-3.5" />
                                        <span>{topic.name}</span>
                                        <ChevronDown
                                            className={`ml-auto h-3.5 w-3.5 transition-transform ${openTopics[topic.id] ? "rotate-180" : ""}`}
                                        />
                                    </Link>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                        </SidebarMenuItem>
                        <CollapsibleContent>
                            {topic.subtopics?.map((subtopic) => (
                                <SidebarMenuItem key={subtopic.id}>
                                    <SidebarMenuButton asChild size="sm" className="ml-4">
                                        <Link href={`/subtopic/${subtopic.id}`}>{subtopic.name}</Link>
                                    </SidebarMenuButton>
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
                <div className="mt-3 space-y-2">
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
                                <Link href="/"><Home className="h-4 w-4" /><span>Dashboard</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/random-question"><FileQuestion className="h-4 w-4" /><span>Random Question</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/glossary"><BookOpen className="h-4 w-4" /><span>Topic Glossary</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="flex justify-between items-center">
                        <span className="flex items-center gap-2 font-semibold">
                            <LayoutPanelTop className="h-4 w-4 text-muted-foreground" />
                            Subjects
                        </span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={toggleSubjectsVisibility} className="hover:bg-muted">
                                        {subjectsVisible ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{subjectsVisible ? "Hide All Subjects" : "Show All Subjects"}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        {subjectsVisible && (
                            <SidebarMenu>
                                {subjects.filter(s => !s.is_shelved && filtered(s)).map(renderSubjectItem)}
                            </SidebarMenu>
                        )}

                        {subjects.some(s => s.is_shelved) && (
                            <>
                                <SidebarGroupLabel className="mt-4 flex justify-between items-center">
                                    <span>Shelved Subjects</span>
                                    <Switch checked={showShelved} onCheckedChange={setShowShelved} />
                                </SidebarGroupLabel>
                                {showShelved && (
                                    <SidebarMenu>
                                        {subjects.filter(s => s.is_shelved && filtered(s)).map(renderSubjectItem)}
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
                                    <Link href="/admin/questions"><Database className="h-4 w-4" /><span>Manage Questions</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/admin/settings"><Settings className="h-4 w-4" /><span>Settings</span></Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/add-question"><Plus className="mr-2 h-4 w-4" />Add Question</Link>
                    </Button>
                    <ModeToggle />
                </div>
            </SidebarFooter>

            <SidebarRail />
            <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
        </Sidebar>
    )
}
