"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

interface AudioDescriptionPlayerProps {
  audioUrl: string
  description: string
}

export default function AudioDescriptionPlayer({ audioUrl, description }: AudioDescriptionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnd)

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnd)
      cancelAnimationFrame(animationRef.current!)
    }
  }, [])

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      cancelAnimationFrame(animationRef.current!)
    } else {
      audio.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    setIsPlaying(!isPlaying)
  }

  // Animation for smooth progress update
  const whilePlaying = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  // Handle end of audio
  const handleEnd = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    cancelAnimationFrame(animationRef.current!)
  }

  // Handle progress change
  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])

    if (!isPlaying) {
      setCurrentTime(value[0])
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    setVolume(newVolume)
    audio.volume = newVolume

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-primary/5 rounded-lg p-4 mb-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={togglePlay}
          size="sm"
          variant="outline"
          className="h-10 w-10 rounded-full p-0 flex-shrink-0"
          aria-label={isPlaying ? "Pause audio description" : "Play audio description"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </Button>

        <div className="flex-grow">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            aria-label="Audio progress"
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="relative">
          <Button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-full p-0"
            aria-label="Volume control"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          {showVolumeControl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-full right-0 mb-2 bg-background border rounded-lg p-3 shadow-lg w-36"
            >
              <div className="flex items-center gap-2">
                <Button onClick={toggleMute} size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  aria-label="Volume control"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Audio Description:</span> Listen to the description of this heritage site.
      </p>
    </div>
  )
}
