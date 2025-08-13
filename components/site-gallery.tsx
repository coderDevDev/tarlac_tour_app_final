"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SiteGalleryProps {
  images: string[]
  videos?: string[]
}

export default function SiteGallery({ images, videos = [] }: SiteGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const allMedia = [...images, ...videos]

  const isVideo = (index: number) => index >= images.length

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {images.map((image, index) => (
          <Dialog key={`image-${index}`}>
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative h-32 cursor-pointer rounded-xl overflow-hidden group"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="h-6 w-6 text-white" />
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 border-none bg-transparent">
              <div className="relative h-[80vh] bg-black/90 rounded-2xl overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}

        {videos &&
          videos.map((video, index) => (
            <Dialog key={`video-${index}`}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (images.length + index) * 0.05 }}
                  className="relative h-32 cursor-pointer rounded-xl overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary ml-1" />
                    </div>
                  </div>
                  <video src={video} className="w-full h-full object-cover" muted playsInline />
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 border-none bg-transparent">
                <div className="bg-black/90 rounded-2xl overflow-hidden">
                  <video src={video} className="w-full h-auto max-h-[80vh]" controls autoPlay />
                </div>
              </DialogContent>
            </Dialog>
          ))}
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-muted/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isVideo(currentIndex) ? (
              <video
                src={allMedia[currentIndex]}
                className="w-full h-auto max-h-[400px] object-contain bg-black"
                controls
              />
            ) : (
              <div className="relative h-[400px]">
                <Image
                  src={allMedia[currentIndex] || "/placeholder.svg"}
                  alt="Featured gallery image"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
