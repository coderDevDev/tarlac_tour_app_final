"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"

// This would normally be in an environment variable
const MAPBOX_TOKEN = "pk.eyJ1IjoibWlyYW5mYW0tMTIzIiwiYSI6ImNtMnUwa3AwNjA5MTAyanB4aGtxNXlkanUifQ.oYbW0ZPDHKZ8_fwy7ilmyA"

interface SiteMapProps {
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  name: string
}

export default function SiteMap({ location, name }: SiteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import mapbox-gl only on the client side
    let map: any = null

    const initializeMap = async () => {
      if (!mapContainer.current) return

      try {
        const mapboxgl = (await import("mapbox-gl")).default
        await import("mapbox-gl/dist/mapbox-gl.css")

        mapboxgl.accessToken = MAPBOX_TOKEN

        map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [location.coordinates.lng, location.coordinates.lat],
          zoom: 14,
        })

        // Add marker
        const marker = new mapboxgl.Marker({ color: "#3b82f6" })
          .setLngLat([location.coordinates.lng, location.coordinates.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${location.address}</p>`))
          .addTo(map)

        marker.togglePopup() // Show popup by default
        setMapLoaded(true)
      } catch (error) {
        console.error("Error loading map:", error)
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [location, name])

  const handleGetDirections = () => {
    const { lat, lng } = location.coordinates
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="h-full rounded-lg bg-muted/30" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 right-4">
        <Button onClick={handleGetDirections} className="rounded-full flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </div>
  )
}
