import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "TechArohana - Technical Interview Preparation",
    description: "Prepare for technical interviews with structured learning and tracking",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <div className="flex min-h-screen">
                            <AppSidebar />
                            <main className="flex-1">{children}</main>
                        </div>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
