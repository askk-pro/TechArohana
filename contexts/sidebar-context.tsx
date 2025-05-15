"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type SidebarContextType = {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Set sidebar to collapsed by default on smaller screens
    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(true)
        }
    }, [isMobile])

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    return <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
