'use client';

import { useState } from 'react';
import { getAllSiteIds } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Globe, Camera, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ARDemoPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const validSiteIds = getAllSiteIds();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AR World Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience true augmented reality by placing 3D models on top of the
          real world through your phone's camera.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* AR World Experience */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AR World</CardTitle>
                  <CardDescription>
                    Place 3D models in real world
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Use your phone's camera to place 3D models on flat surfaces in
                the real world. Perfect for visualizing heritage sites in their
                actual locations.
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold">Features:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Real-time camera feed with AR overlay
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Tap to place 3D models on surfaces
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Multiple model placement support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Interactive model management
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full gap-2">
                  <Link href={`/ar-world?siteId=${validSiteIds[0] || '1'}`}>
                    Try AR World
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AR Camera Experience */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}>
          <Card className="h-full border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Camera className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AR Camera</CardTitle>
                  <CardDescription>Scan QR codes for 3D models</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Scan QR codes at heritage sites to view 3D models in a virtual
                environment. Great for exploring models without AR hardware
                requirements.
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold">Features:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    QR code scanning with camera
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    Image upload support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    3D model viewing in virtual space
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    Touch and gesture controls
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href="/ar-camera">
                    Try AR Camera
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Site Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Test with Different Sites
            </CardTitle>
            <CardDescription>
              Choose a specific site to test the AR World experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {validSiteIds.map(siteId => (
                <Link key={siteId} href={`/ar-world?siteId=${siteId}`}>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setSelectedSite(siteId)}>
                    <Globe className="h-4 w-4" />
                    Site {siteId}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          AR World requires a device with WebXR support (modern smartphones)
        </div>
      </motion.div>
    </div>
  );
}

