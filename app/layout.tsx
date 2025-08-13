import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import BottomNavigation from "@/components/bottom-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tarlac Heritage Tour Guide",
  description: "Explore the rich cultural heritage of Tarlac Province",
    generator: 'v0.dev'
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
          <div className="flex flex-col min-h-screen bg-dot-pattern">
            <Navigation />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <BottomNavigation />
            <footer className="py-6 border-t">
              <div className="container px-4 md:px-6">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Tarlac Heritage Tour Guide. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
