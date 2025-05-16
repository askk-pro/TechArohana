"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

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
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground mt-2">There was an error loading the subjects. Please try again.</p>
            </div>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    )
}
