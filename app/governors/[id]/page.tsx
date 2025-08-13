"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { getGovernorById } from "@/lib/governors-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, MapPin, GraduationCap, Award, Share2, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function GovernorPage() {
  const { id } = useParams()
  const [governor, setGovernor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const governorData = getGovernorById(id.toString())
      if (governorData) {
        setGovernor(governorData)
      }
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded-md"></div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-64 sm:h-80 lg:h-[400px] bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded-md"></div>
              <div className="h-4 w-1/2 bg-muted rounded-md"></div>
              <div className="h-24 bg-muted rounded-md"></div>
              <div className="flex gap-4">
                <div className="h-10 w-32 bg-muted rounded-md"></div>
                <div className="h-10 w-32 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!governor) {
    notFound()
  }

  return (
    <div className="container px-4 py-8">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/governors"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all governors
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-64 sm:h-80 lg:h-full rounded-2xl overflow-hidden shadow-xl"
        >
          <Image
            src={governor.photo || "/placeholder.svg"}
            alt={governor.name}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1">Governor</Badge>
          <h1 className="text-3xl font-bold mb-2">{governor.name}</h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Term: {governor.term}</span>
          </div>
          {governor.party && (
            <div className="mb-4">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {governor.party}
              </Badge>
            </div>
          )}

          <p className="mb-6 text-muted-foreground">{governor.biography}</p>

          {governor.historicalContext && (
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Historical Context</h3>
              </div>
              <p className="text-sm text-muted-foreground">{governor.historicalContext}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="ghost" size="icon" className="rounded-full ml-auto">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="achievements" className="mt-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-full p-1">
          <TabsTrigger value="achievements" className="rounded-full">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="background" className="rounded-full">
            Background
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="achievements" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Key Achievements</h2>
                  </div>
                  <ul className="space-y-3">
                    {governor.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="background" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {governor.birthDate && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">Birth Date</h3>
                        </div>
                        <p className="text-muted-foreground">{governor.birthDate}</p>
                      </div>
                    )}

                    {governor.birthPlace && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">Birth Place</h3>
                        </div>
                        <p className="text-muted-foreground">{governor.birthPlace}</p>
                      </div>
                    )}

                    {governor.education && (
                      <div className="md:col-span-2 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <GraduationCap className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">Education</h3>
                        </div>
                        <p className="text-muted-foreground">{governor.education}</p>
                      </div>
                    )}

                    {governor.careerHighlights && (
                      <div className="md:col-span-2 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">Career Highlights</h3>
                        </div>
                        <ul className="space-y-2">
                          {governor.careerHighlights.map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-muted-foreground">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
