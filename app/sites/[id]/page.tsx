'use client';

import { getSiteById, type HeritageSite } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  History,
  Camera,
  Map,
  ArrowLeft,
  Share2,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SiteGallery from '@/components/site-gallery';
import SiteMap from '@/components/site-map';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import AudioDescriptionPlayer from '@/components/audio-description-player';
import QRCodeDisplay from '@/components/qr-code-display';
import ARModal from '@/components/ar-modal';

export default function SitePage() {
  const { id } = useParams();
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showARModal, setShowARModal] = useState(false);

  useEffect(() => {
    if (id) {
      const siteData = getSiteById(id.toString());
      setSite(siteData || null);
      setLoading(false);
    }
  }, [id]);

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
    );
  }

  if (!site) {
    notFound();
  }

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const openARModal = () => {
    setShowARModal(true);
  };

  const closeARModal = () => {
    setShowARModal(false);
  };

  return (
    <div className="container px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}>
        <Link
          href="/sites"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to all sites
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-64 sm:h-80 lg:h-full rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={site.images[0] || '/placeholder.svg'}
            alt={site.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1">
            Heritage Site
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{site.name}</h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{site.location.address}</span>
          </div>

          <p className="mb-6 text-muted-foreground">{site.fullDescription}</p>
          {site.audioDescription && (
            <AudioDescriptionPlayer
              audioUrl={site.audioDescription}
              description={site.fullDescription}
            />
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={openARModal} className="rounded-full">
              <Camera className="mr-2 h-4 w-4" />
              View in AR
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/map?siteId=${site.id}`}>
                <Map className="mr-2 h-4 w-4" />
                Get Directions
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={toggleQRCode}>
              <QrCode className="mr-2 h-4 w-4" />
              {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full ml-auto">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <AnimatePresence>
            {showQRCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden">
                <Card className="border-none shadow-lg overflow-hidden mb-8">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-medium mb-4">
                        Scan to view in AR
                      </h3>
                      <QRCodeDisplay
                        url={`${window.location.origin}/ar-camera?siteId=${site.id}`}
                        siteName={site.name}
                      />
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Scan this QR code with any scanner to open the AR
                        experience for {site.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <Tabs defaultValue="about" className="mt-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 rounded-full p-1">
          <TabsTrigger value="about" className="rounded-full">
            About
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-full">
            Gallery
          </TabsTrigger>
          <TabsTrigger value="map" className="rounded-full">
            Location
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="about" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <History className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">History</h2>
                  </div>
                  <p className="text-muted-foreground">{site.history}</p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <SiteGallery images={site.images} videos={site.videos} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-[400px] rounded-xl overflow-hidden">
                    <SiteMap location={site.location} name={site.name} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      {/* AR Modal */}
      {site && (
        <ARModal
          isOpen={showARModal}
          onClose={closeARModal}
          site={{
            id: site.id,
            name: site.name,
            modelUrl: site.modelUrl
          }}
        />
      )}
    </div>
  );
}
