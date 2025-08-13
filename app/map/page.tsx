"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, MapPin, List, X, Search } from "lucide-react"
import { allHeritageSites, getSiteById } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

// This would normally be in an environment variable
const MAPBOX_TOKEN = "YOUR_MAPBOX_TOKEN"

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()

  const filteredSites = allHeritageSites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    const initializeMap = async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default
        await import("mapbox-gl/dist/mapbox-gl.css")

        mapboxgl.accessToken = MAPBOX_TOKEN

        // Center on Tarlac province
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [120.5953, 15.4883], // Tarlac City coordinates
          zoom: 10,
        })

        setMap(mapInstance)

        mapInstance.on("load", () => {
          setMapLoaded(true)

          // Add markers for all heritage sites
          allHeritageSites.forEach((site) => {
            const { lat, lng } = site.location.coordinates

            // Create custom marker element
            const el = document.createElement("div")
            el.className =
              "flex items-center justify-center w-10 h-10 bg-primary rounded-full text-white cursor-pointer shadow-lg transition-transform hover:scale-110"
            el.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>'

            // Add click event
            el.addEventListener("click", () => {
              setSelectedSiteId(site.id)
            })

            // Add marker to map
            new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(mapInstance)
          })

          // Check if siteId is in URL params
          const siteId = searchParams.get("siteId")
          if (siteId) {
            setSelectedSiteId(siteId)

            // Center map on the selected site
            const site = getSiteById(siteId)
            if (site) {
              mapInstance.flyTo({
                center: [site.location.coordinates.lng, site.location.coordinates.lat],
                zoom: 15,
                essential: true,
              })
            }
          }
        })
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
  }, [searchParams])

  // When selected site changes, update map
  useEffect(() => {
    if (selectedSiteId && map) {
      const site = getSiteById(selectedSiteId)
      if (site) {
        map.flyTo({
          center: [site.location.coordinates.lng, site.location.coordinates.lat],
          zoom: 15,
          essential: true,
          duration: 1500,
        })
      }
    }
  }, [selectedSiteId, map])

  const selectedSite = selectedSiteId ? getSiteById(selectedSiteId) : null

  const handleGetDirections = () => {
    if (selectedSite) {
      const { lat, lng } = selectedSite.location.coordinates
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")
    }
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
            className="absolute top-0 left-0 h-full z-10"
          >
            <Card className="h-full w-80 rounded-none rounded-r-2xl shadow-xl border-none">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold mb-2">Heritage Sites</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {filteredSites.length > 0 ? (
                    filteredSites.map((site) => (
                      <motion.button
                        key={site.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full text-left p-4 border-b flex items-start gap-3 hover:bg-muted transition-colors ${selectedSiteId === site.id ? "bg-primary/10" : ""}`}
                        onClick={() => setSelectedSiteId(site.id)}
                      >
                        <div
                          className={`p-2 rounded-full ${selectedSiteId === site.id ? "bg-primary/20" : "bg-muted"}`}
                        >
                          <MapPin
                            className={`h-5 w-5 ${selectedSiteId === site.id ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <h3 className={`font-medium ${selectedSiteId === site.id ? "text-primary" : ""}`}>
                            {site.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{site.location.address}</p>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No sites found matching your search.</p>
                      <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected site info */}
      <AnimatePresence>
        {selectedSite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 md:bottom-4 left-4 right-4 z-10"
          >
            <Card className="glass shadow-lg border-none">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{selectedSite.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSite.location.address}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedSiteId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm my-2 line-clamp-2">{selectedSite.shortDescription}</p>

                <div className="flex gap-2 mt-4">
                  <Button asChild className="flex-1 rounded-full">
                    <a href={`/sites/${selectedSite.id}`}>View Details</a>
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-full" onClick={handleGetDirections}>
                    <Navigation className="mr-2 h-4 w-4" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
