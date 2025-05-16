"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground max-w-md">
                    There was an error loading the subtopics. Please try again or contact support if the problem persists.
                </p>
            </div>
            <Button onClick={() => reset()} className="gap-1.5 rounded-xl">
                <RefreshCw className="h-4 w-4" />
                Try again
            </Button>
        </div>
    )
}
