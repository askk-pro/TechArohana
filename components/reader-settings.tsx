"use client"

import { useEffect, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const defaultSettings = {
    fontSize: 16,
    lineHeight: 1.6,
    contentWidth: 700,
}

export function ReaderSettings() {
    const [visible, setVisible] = useState(false)
    const [fontSize, setFontSize] = useState(defaultSettings.fontSize)
    const [lineHeight, setLineHeight] = useState(defaultSettings.lineHeight)
    const [contentWidth, setContentWidth] = useState(defaultSettings.contentWidth)

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("reader-settings")
        if (stored) {
            const parsed = JSON.parse(stored)
            setFontSize(parsed.fontSize || defaultSettings.fontSize)
            setLineHeight(parsed.lineHeight || defaultSettings.lineHeight)
            setContentWidth(parsed.contentWidth || defaultSettings.contentWidth)
        }
    }, [])

    // Persist on change
    useEffect(() => {
        localStorage.setItem("reader-settings", JSON.stringify({ fontSize, lineHeight, contentWidth }))
        document.documentElement.style.setProperty("--reader-font-size", `${fontSize}px`)
        document.documentElement.style.setProperty("--reader-line-height", `${lineHeight}`)
        document.documentElement.style.setProperty("--reader-width", `${contentWidth}px`)
    }, [fontSize, lineHeight, contentWidth])

    return (
        <>
            <Button
                className="fixed bottom-20 right-4 z-50 rounded-full shadow-md"
                variant="outline"
                size="icon"
                onClick={() => setVisible(!visible)}
            >
                <SlidersHorizontal className="h-5 w-5" />
            </Button>

            {visible && (
                <div className="fixed bottom-28 right-4 z-50 w-72 rounded-lg border bg-background p-4 shadow-lg space-y-4">
                    <div>
                        <label className="text-xs font-medium">Font Size ({fontSize}px)</label>
                        <input
                            type="range"
                            min="14"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium">Line Height ({lineHeight})</label>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.1"
                            value={lineHeight}
                            onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium">Content Width ({contentWidth}px)</label>
                        <input
                            type="range"
                            min="400"
                            max="900"
                            step="50"
                            value={contentWidth}
                            onChange={(e) => setContentWidth(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            )}
        </>
    )
}
