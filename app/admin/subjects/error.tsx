"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-2 max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground">
                    There was an error loading the subjects. Please try again or contact support if the problem persists.
                </p>
            </div>

            <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="break-all">
                    {error.message || "An unknown error occurred"}
                    {error.digest && <div className="text-xs mt-2">Error ID: {error.digest}</div>}
                </AlertDescription>
            </Alert>

            <div className="flex gap-4">
                <Button onClick={() => reset()} className="gap-1.5 rounded-xl">
                    <RefreshCw className="h-4 w-4" />
                    Try again
                </Button>
                <Button variant="outline" asChild className="gap-1.5 rounded-xl">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}
