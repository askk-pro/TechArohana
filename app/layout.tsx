import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "TechArohana - Technical Interview Preparation",
    description: "Prepare for technical interviews with structured learning and confidence tracking.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-background text-foreground min-h-screen antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <div className="flex min-h-screen overflow-hidden">
                            <AppSidebar />
                            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
                        </div>
                    </SidebarProvider>
                    <MobileBottomNav />
                </ThemeProvider>
            </body>
        </html>
    );
}
