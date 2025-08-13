"use client"

import { heritageSites } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Collect all images and videos from all sites
  const allImages = heritageSites.flatMap((site) =>
    site.images.map((image) => ({ url: image, siteName: site.name, siteId: site.id })),
  )

  const allVideos = heritageSites
    .filter((site) => site.videos && site.videos.length > 0)
    .flatMap((site) => site.videos!.map((video) => ({ url: video, siteName: site.name, siteId: site.id })))

  const filteredImages = allImages.filter((image) => image.siteName.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredVideos = allVideos.filter((video) => video.siteName.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Multimedia Gallery</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore photos and videos showcasing the rich cultural heritage and historical significance of Tarlac's
          landmarks.
        </p>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by site name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>
      </motion.div>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-full p-1">
          <TabsTrigger value="photos" className="rounded-full">
            Photos
          </TabsTrigger>
          <TabsTrigger value="videos" className="rounded-full">
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-8">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={`image-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-none shadow-lg card-hover-effect">
                    <Link href={`/sites/${image.siteId}`}>
                      <div className="relative h-48 cursor-pointer overflow-hidden">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.siteName}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium">{image.siteName}</p>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No photos found matching your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-8">
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={`video-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden border-none shadow-lg card-hover-effect">
                    <Link href={`/sites/${video.siteId}`}>
                      <div className="relative cursor-pointer overflow-hidden rounded-t-lg">
                        <video src={video.url} className="w-full h-48 object-cover" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                            <Play className="h-7 w-7 text-primary ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium">{video.siteName}</p>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos available matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
