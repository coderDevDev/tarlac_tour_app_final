"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/sites",
      label: "Heritage Sites",
      active: pathname === "/sites" || pathname.startsWith("/sites/"),
    },
    {
      href: "/governors",
      label: "Governors",
      active: pathname === "/governors" || pathname.startsWith("/governors/"),
    },
    {
      href: "/ar-camera",
      label: "AR Camera",
      active: pathname === "/ar-camera",
    },
    {
      href: "/map",
      label: "Map",
      active: pathname === "/map",
    },
    {
      href: "/gallery",
      label: "Gallery",
      active: pathname === "/gallery",
    },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/50 backdrop-blur-sm",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Landmark className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:inline-block">Tarlac Heritage</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="relative">
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
              </span>
              {route.active && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Title - Center */}
        <div className="flex md:hidden items-center absolute left-1/2 transform -translate-x-1/2">
          <motion.span
            className="font-bold text-lg gradient-text"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {routes.find((route) => route.active)?.label || "Tarlac"}
          </motion.span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full hidden md:flex" asChild>
            <Link href="/ar-camera">Try AR Experience</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
