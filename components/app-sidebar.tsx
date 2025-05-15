"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Code, Database, FileQuestion, Home, Layers, Plus, Search, Settings, Sparkles } from "lucide-react"
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
import { ChevronDown } from "lucide-react"

// Mock data for subjects, topics, and subtopics
const subjects = [
    {
        id: "1",
        name: "JavaScript",
        topics: [
            {
                id: "1-1",
                name: "Core Concepts",
                subtopics: [
                    { id: "1-1-1", name: "Variables & Data Types" },
                    { id: "1-1-2", name: "Functions & Scope" },
                    { id: "1-1-3", name: "Objects & Prototypes" },
                ],
            },
            {
                id: "1-2",
                name: "Advanced JS",
                subtopics: [
                    { id: "1-2-1", name: "Closures" },
                    { id: "1-2-2", name: "Promises & Async" },
                    { id: "1-2-3", name: "ES6+ Features" },
                ],
            },
        ],
    },
    {
        id: "2",
        name: "Data Structures",
        topics: [
            {
                id: "2-1",
                name: "Linear DS",
                subtopics: [
                    { id: "2-1-1", name: "Arrays" },
                    { id: "2-1-2", name: "Linked Lists" },
                    { id: "2-1-3", name: "Stacks & Queues" },
                ],
            },
            {
                id: "2-2",
                name: "Non-Linear DS",
                subtopics: [
                    { id: "2-2-1", name: "Trees" },
                    { id: "2-2-2", name: "Graphs" },
                    { id: "2-2-3", name: "Hash Tables" },
                ],
            },
        ],
    },
]

export function AppSidebar() {
    const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})
    const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({})

    const toggleSubject = (id: string) => {
        setOpenSubjects((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const toggleTopic = (id: string) => {
        setOpenTopics((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">TechArohana</h1>
                </div>
                <div className="px-2 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <SidebarInput placeholder="Search questions..." className="pl-9" />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
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
                    <SidebarGroupLabel>Subjects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {subjects.map((subject) => (
                                <Collapsible
                                    key={subject.id}
                                    open={openSubjects[subject.id]}
                                    onOpenChange={() => toggleSubject(subject.id)}
                                    className="w-full"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton>
                                                <Layers className="h-4 w-4" />
                                                <span>{subject.name}</span>
                                                <ChevronDown
                                                    className={`ml-auto h-4 w-4 transition-transform ${openSubjects[subject.id] ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                    </SidebarMenuItem>

                                    <CollapsibleContent>
                                        {subject.topics.map((topic) => (
                                            <Collapsible
                                                key={topic.id}
                                                open={openTopics[topic.id]}
                                                onOpenChange={() => toggleTopic(topic.id)}
                                                className="ml-4 mt-1"
                                            >
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton size="sm">
                                                            <Code className="h-3.5 w-3.5" />
                                                            <span>{topic.name}</span>
                                                            <ChevronDown
                                                                className={`ml-auto h-3.5 w-3.5 transition-transform ${openTopics[topic.id] ? "rotate-180" : ""
                                                                    }`}
                                                            />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                </SidebarMenuItem>

                                                <CollapsibleContent>
                                                    {topic.subtopics.map((subtopic) => (
                                                        <SidebarMenuItem key={subtopic.id}>
                                                            <SidebarMenuButton asChild size="sm" className="ml-4">
                                                                <Link href={`/subtopic/${subtopic.id}`}>
                                                                    <span>{subtopic.name}</span>
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
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
