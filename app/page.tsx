"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, Info, Map } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import FeaturedSites from "@/components/featured-sites"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        <Image
          src="https://www.wheninmanila.com/wp-content/uploads/2015/03/Lakbay-Norte-Tarlac-4.jpg"
          alt="Tarlac Heritage"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.h1
              variants={fadeIn}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Discover Tarlac's Heritage
            </motion.h1>
            <motion.p variants={fadeIn} className="mt-4 text-xl text-white max-w-md mx-auto">
              Explore the rich history and cultural landmarks of Tarlac Province
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/sites">Explore Sites</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
              >
                <Link href="/ar-camera">AR Experience</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Main Features */}
      <section className="container px-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Experience Tarlac Heritage</h2>
        </motion.div>

        <Tabs defaultValue="sites" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-full p-1">
            <TabsTrigger value="sites" className="rounded-full">
              Sites
            </TabsTrigger>
            <TabsTrigger value="ar" className="rounded-full">
              AR Camera
            </TabsTrigger>
            <TabsTrigger value="map" className="rounded-full">
              Map
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-full">
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sites" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Info size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Heritage Sites</h3>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Explore historical landmarks including the Ninoy Aquino Ancestral House, Capas National Shrine, and
                    Tarlac Cathedral.
                  </p>
                  <Button asChild className="rounded-full px-6">
                    <Link href="/sites">View All Sites</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="ar" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Camera size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">AR Experience</h3>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Scan QR codes at heritage sites to view 3D models and additional information through augmented
                    reality.
                  </p>
                  <Button asChild className="rounded-full px-6">
                    <Link href="/ar-camera">Open AR Camera</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Map size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Interactive Map</h3>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Navigate through Tarlac with our interactive map showing all heritage sites and providing
                    directions.
                  </p>
                  <Button asChild className="rounded-full px-6">
                    <Link href="/map">Open Map</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="overflow-hidden border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Multimedia Gallery</h3>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    View photos and videos showcasing Tarlac's cultural heritage and historical significance.
                  </p>
                  <Button asChild className="rounded-full px-6">
                    <Link href="/gallery">View Gallery</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Featured Sites */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center mb-2">Featured Heritage Sites</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Discover the most iconic historical landmarks and cultural treasures of Tarlac
            </p>
          </motion.div>
          <FeaturedSites />
        </div>
      </section>
    </div>
  )
}
