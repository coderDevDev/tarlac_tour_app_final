"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import { getFeaturedSites } from "@/lib/data"
import { motion } from "framer-motion"

export default function FeaturedSites() {
  const featuredSites = getFeaturedSites()

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {featuredSites.map((site, index) => (
        <motion.div
          key={site.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
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
                <h3 className="text-xl font-bold text-white mb-1">{site.name}</h3>
                <div className="flex items-center text-sm text-white/80">
                  <MapPin className="h-4 w-4 mr-1" />
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
    </div>
  )
}
