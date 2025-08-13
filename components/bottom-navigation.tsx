"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Landmark, Camera, Map, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function BottomNavigation() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Hide on scroll down, show on scroll up
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/sites",
      label: "Sites",
      icon: Landmark,
      active: pathname === "/sites" || pathname.startsWith("/sites/"),
    },
    {
      href: "/map",
      label: "Map",
      icon: Map,
      active: pathname === "/map",
    },
    {
      href: "/ar-camera",
      label: "AR",
      icon: Camera,
      active: pathname === "/ar-camera",
    },
    {
      href: "/governors",
      label: "Governors",
      icon: Users,
      active: pathname === "/governors" || pathname.startsWith("/governors/"),
    },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-background/95 backdrop-blur-md shadow-lg border-t">
        <div className="flex items-center justify-around h-16 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                route.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  route.active ? "bg-primary/10" : "hover:bg-muted",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.active && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className="text-xs mt-1">{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
