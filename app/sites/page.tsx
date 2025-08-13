"use client"

import { heritageSites } from "@/lib/data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSites = heritageSites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Heritage Sites of Tarlac</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore the rich cultural and historical landmarks that showcase Tarlac's heritage and significance in
          Philippine history.
        </p>

        <div className="w-full max-w-md mt-8">
          <Input
            type="text"
            placeholder="Search heritage sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full px-6"
          />
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredSites.map((site, index) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-lg card-hover-effect h-full flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={site.images[0] || "/placeholder.svg"}
                  alt={site.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl font-bold text-white mb-1">{site.name}</h2>
                  <div className="flex items-center text-sm text-white/80">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{site.location.address}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 flex-grow">
                <p className="line-clamp-3 text-muted-foreground">{site.shortDescription}</p>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button asChild variant="ghost" className="w-full justify-between group">
                  <Link href={`/sites/${site.id}`}>
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {filteredSites.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No heritage sites found matching your search.</p>
            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
