"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
    tooltipMessage?: string
    onCopied?: () => void
    className?: string
}

export function CopyButton({ value, tooltipMessage = "Copy", onCopied, className, ...props }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false)

    React.useEffect(() => {
        if (hasCopied) {
            const timeout = setTimeout(() => {
                setHasCopied(false)
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [hasCopied])

    const copyToClipboard = React.useCallback(
        async (e: React.MouseEvent) => {
            e.stopPropagation() // Prevent event bubbling
            try {
                await navigator.clipboard.writeText(value)
                setHasCopied(true)
                if (onCopied) {
                    onCopied()
                }
            } catch (error) {
                console.error("Failed to copy text: ", error)
            }
        },
        [value, onCopied],
    )

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                            hasCopied && "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600",
                            className,
                        )}
                        onClick={copyToClipboard}
                        {...props}
                    >
                        {hasCopied ? (
                            <Check className="h-3.5 w-3.5 animate-in zoom-in-50 duration-300" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">Copy</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="text-xs">
                    {hasCopied ? "Copied!" : tooltipMessage}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
