
"use client"

import Link from "next/link"
import { Home, FileQuestion, Star, User } from "lucide-react"

export function MobileBottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-background border-t border-border p-2 md:hidden">
            <Link href="/" className="text-xs flex flex-col items-center">
                <Home className="h-5 w-5" />
                <span>Home</span>
            </Link>
            <Link href="/random-question" className="text-xs flex flex-col items-center">
                <FileQuestion className="h-5 w-5" />
                <span>Random</span>
            </Link>
            <Link href="/important" className="text-xs flex flex-col items-center">
                <Star className="h-5 w-5" />
                <span>Important</span>
            </Link>
            <Link href="/profile" className="text-xs flex flex-col items-center">
                <User className="h-5 w-5" />
                <span>Profile</span>
            </Link>
        </nav>
    )
}
