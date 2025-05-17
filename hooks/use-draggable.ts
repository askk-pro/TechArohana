"use client"

import { useState, useEffect, useRef } from "react"

interface UseDraggableOptions {
    minWidth?: number
    maxWidth?: number
    defaultWidth?: number
    storageKey?: string
    direction?: "right" | "left"
}

export function useDraggable({
    minWidth = 200,
    maxWidth = 400,
    defaultWidth = 260,
    storageKey = "sidebar-width",
    direction = "right",
}: UseDraggableOptions = {}) {
    // Try to get stored width from localStorage
    const getStoredWidth = () => {
        if (typeof window === "undefined") return defaultWidth
        const stored = localStorage.getItem(storageKey)
        return stored ? Number.parseInt(stored, 10) : defaultWidth
    }

    const [width, setWidth] = useState(getStoredWidth)
    const [isDragging, setIsDragging] = useState(false)
    const dragRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault()
            setIsDragging(true)
        }

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false)
                // Save width to localStorage
                localStorage.setItem(storageKey, width.toString())
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            let newWidth
            if (direction === "right") {
                newWidth = e.clientX
            } else {
                newWidth = window.innerWidth - e.clientX
            }

            // Constrain width between min and max
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
            setWidth(newWidth)
        }

        const dragElement = dragRef.current
        if (dragElement) {
            dragElement.addEventListener("mousedown", handleMouseDown)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            if (dragElement) {
                dragElement.removeEventListener("mousedown", handleMouseDown)
            }
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, width, minWidth, maxWidth, storageKey, direction])

    return { width, isDragging, dragRef }
}
