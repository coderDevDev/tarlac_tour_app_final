"use client"

import { useState } from "react"
import { governors } from "@/lib/governors-data"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Calendar, User2, LayoutGrid, ListOrdered } from "lucide-react"

export default function GovernorsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGovernors = governors.filter(
    (governor) =>
      governor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      governor.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (governor.party && governor.party.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Sort governors chronologically for timeline view (most recent first)
  const sortedGovernors = [...filteredGovernors].sort((a, b) => {
    // Extract the start year from the term (e.g., "2016-Present" -> 2016)
    const getStartYear = (term) => {
      const match = term.match(/(\d{4})/)
      return match ? Number.parseInt(match[1]) : 0
    }

    // Sort in descending order (most recent first)
    return getStartYear(b.term) - getStartYear(a.term)
  })

  return (
    <div className="container px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Governors of Tarlac</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore the leadership history of Tarlac Province through its governors from 1898 to the present, spanning the
          American colonial period, Japanese occupation, and Philippine independence.
        </p>

        <div className="w-full max-w-md mt-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, term, or party..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full pl-10 pr-6"
          />
        </div>
      </motion.div>

      <Tabs defaultValue="grid" className="w-full mb-8">
        <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 rounded-full p-1">
          <TabsTrigger value="grid" className="rounded-full">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-full">
            <ListOrdered className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGovernors.map((governor, index) => (
              <motion.div
                key={governor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/governors/${governor.id}`} className="block h-full">
                  <Card className="overflow-hidden border-none shadow-lg card-hover-effect h-full">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <Image
                        src={governor.photo || "/placeholder.svg"}
                        alt={governor.name}
                        fill
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-bold text-white mb-1">{governor.name}</h2>
                        <div className="flex items-center text-sm text-white/80 mb-2">
                          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{governor.term}</span>
                        </div>
                        {governor.party && (
                          <Badge variant="secondary" className="bg-primary/20 text-white border-none">
                            {governor.party}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="line-clamp-3 text-muted-foreground text-sm">
                        {governor.biography.substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 pl-8 pb-8">
            {sortedGovernors.map((governor, index) => (
              <motion.div
                key={governor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="mb-12 relative"
              >
                {/* Timeline dot */}
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-10 md:-left-14 top-2 border-4 border-background"></div>

                {/* Timeline content */}
                <Link href={`/governors/${governor.id}`} className="block">
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 h-48 md:h-auto overflow-hidden bg-muted">
                        <Image
                          src={governor.photo || "/placeholder.svg"}
                          alt={governor.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h2 className="text-xl font-bold">{governor.name}</h2>
                          <Badge className="self-start md:self-auto mt-2 md:mt-0 bg-primary/10 text-primary rounded-full px-3 py-1">
                            {governor.term}
                          </Badge>
                        </div>

                        {governor.party && (
                          <Badge variant="outline" className="mb-3 rounded-full">
                            {governor.party}
                          </Badge>
                        )}

                        <p className="text-muted-foreground line-clamp-3">{governor.biography.substring(0, 200)}...</p>

                        {governor.historicalContext && (
                          <div className="mt-3 p-2 bg-primary/5 rounded-md text-sm text-muted-foreground">
                            <span className="font-medium">Historical Context:</span> {governor.historicalContext}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredGovernors.length === 0 && (
        <div className="py-12 text-center">
          <User2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No governors found matching your search.</p>
          <button onClick={() => setSearchQuery("")} className="text-primary hover:underline mt-2">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
