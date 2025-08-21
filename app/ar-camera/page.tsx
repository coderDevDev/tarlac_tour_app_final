'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, X, Upload, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getSiteById, getAllSiteIds } from '@/lib/data';
import ARViewer from '@/components/ar-viewer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ARCameraPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId');
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<
    'granted' | 'denied' | 'prompt' | 'unknown'
  >('unknown');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const site = siteId ? getSiteById(siteId) : null;
  const validSiteIds = getAllSiteIds();

  // Check camera permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check if the browser supports the permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({
            name: 'camera' as PermissionName
          });
          setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');

          // Listen for permission changes
          result.onchange = () => {
            setCameraPermission(
              result.state as 'granted' | 'denied' | 'prompt'
            );
          };
        }
      } catch (err) {
        console.error('Error checking camera permissions:', err);
      }
    };

    checkPermissions();
  }, []);

  // Add this useEffect to log camera permission status changes
  // Add this right after the existing useEffect for checking permissions

  useEffect(() => {
    console.log('Camera permission status:', cameraPermission);

    // If permission was just granted, try starting the camera
    if (cameraPermission === 'granted' && cameraActive && !streamRef.current) {
      console.log('Permission granted, starting camera');
      startCamera();
    }
  }, [cameraPermission, cameraActive]);

  // Handle camera activation
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  // Start the camera
  const startCamera = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // First stop any existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log('Requesting camera access...');

      // Request camera access with explicit constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      console.log('Camera access granted, setting up video element');

      // Store the stream reference for cleanup
      streamRef.current = stream;

      // Make sure the video element exists before setting its source
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear any existing source
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing video');
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log('Video playing successfully');
                // Start scanning for QR codes only after video is playing
                startQrScanning();
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError(`Error displaying camera feed: ${err.message}`);
              });
          }
        };
      } else {
        console.error('Video element not found');
        throw new Error('Video element not found');
      }

      setCameraPermission('granted');
    } catch (err: any) {
      console.error('Error starting camera:', err);

      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        setCameraPermission('denied');
        setError(
          'Camera permission denied. Please allow camera access in your browser settings and try again.'
        );
      } else if (
        err.name === 'NotFoundError' ||
        err.name === 'DevicesNotFoundError'
      ) {
        setError('No camera found on this device.');
      } else {
        setError(`Error accessing camera: ${err.message || 'Unknown error'}`);
      }

      setCameraActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear any scanning intervals
    if (window.qrScanInterval) {
      clearInterval(window.qrScanInterval);
      window.qrScanInterval = null;
    }
  };

  // Start scanning for QR codes
  const startQrScanning = async () => {
    setScanning(true);
    console.log('Starting QR code scanning');

    try {
      // Dynamically import jsQR
      const jsQRModule = await import('jsqr');
      const jsQR = jsQRModule.default;
      console.log('jsQR loaded successfully');

      // Clear any existing interval
      if (window.qrScanInterval) {
        clearInterval(window.qrScanInterval);
      }

      // Create a scanning interval
      window.qrScanInterval = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;

          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Set canvas dimensions to match video
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (videoWidth && videoHeight) {
              canvas.width = videoWidth;
              canvas.height = videoHeight;

              // Draw video frame to canvas
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get image data for QR code detection
                const imageData = ctx.getImageData(
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );

                // Detect QR code
                const code = jsQR(
                  imageData.data,
                  imageData.width,
                  imageData.height,
                  {
                    inversionAttempts: 'dontInvert'
                  }
                );

                if (code) {
                  console.log('QR code detected:', code.data);
                  // Process the QR code
                  processQrCode(code.data);
                }
              }
            }
          }
        }
      }, 200); // Scan every 200ms
    } catch (err) {
      console.error('Error starting QR scanning:', err);
      setError(
        'Failed to initialize QR scanner. Please try uploading an image instead.'
      );
      setScanning(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load jsQR dynamically
      const jsQR = (await import('jsqr')).default;

      // Create an image from the file
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise(resolve => {
        img.onload = resolve;
      });

      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      // Get image data for QR code processing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        processQrCode(code.data);
      } else {
        setError('No QR code found in the image. Please try another image.');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError(
        'Failed to process the image. Please try another image or use the camera scanner.'
      );
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Process QR code data
  const processQrCode = (data: string) => {
    try {
      // Extract the siteId from the QR code data
      let extractedSiteId: string | null = null;

      // Case 1: Full URL (e.g., https://example.com/ar-camera?siteId=site-id)
      if (data.includes('/ar-camera?siteId=')) {
        try {
          const url = new URL(data);
          extractedSiteId = url.searchParams.get('siteId');
        } catch (e) {
          // If it's not a valid URL, try to extract the siteId directly
          const match = data.match(/\/ar-camera\?siteId=([^&]+)/);
          if (match && match[1]) {
            extractedSiteId = match[1];
          }
        }
      }
      // Case 2: Just the path (e.g., /ar-camera?siteId=site-id)
      else if (data.startsWith('/ar-camera?siteId=')) {
        const params = new URLSearchParams(data.split('?')[1]);
        extractedSiteId = params.get('siteId');
      }
      // Case 3: Just the site ID
      else if (validSiteIds.includes(data)) {
        extractedSiteId = data;
      }

      if (extractedSiteId && validSiteIds.includes(extractedSiteId)) {
        // Stop scanning and camera
        setScanning(false);
        setCameraActive(false);

        // Navigate to the AR experience
        router.push(`/ar-camera?siteId=${extractedSiteId}`);
      } else {
        setError('Invalid QR code. Please scan a valid heritage site QR code.');
      }
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Failed to process QR code. Please try again.');
    }
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Request camera permissions
  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission...');

      // Check if we already have permission
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({
          name: 'camera' as PermissionName
        });
        console.log('Permission query result:', result.state);

        if (result.state === 'granted') {
          console.log('Camera permission already granted');
          setCameraPermission('granted');
        }
      }

      // Set camera active which will trigger the useEffect to start the camera
      setCameraActive(true);
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setError('Failed to request camera permission. Please try again.');
    }
  };

  // If a siteId is provided, show the AR viewer for that site
  if (siteId && site) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AR Experience: {site.name}</h1>
          <div className="flex gap-2">
            <Link href={`/ar-world?siteId=${siteId}`}>
              <Button variant="outline" className="gap-2">
                <Globe className="h-4 w-4" />
                AR World
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => router.push('/ar-camera')}
              className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Close AR
            </Button>
          </div>
        </div>

        <div className="h-[70vh] bg-black/5 rounded-2xl overflow-hidden shadow-lg">
          <ARViewer
            modelUrl={site.modelUrl || '/models/placeholder.glb'}
            siteName={site.name}
          />
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>
            Move your device around to explore the 3D model. Pinch to zoom in
            and out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-6 text-center">
        AR Experience
      </motion.h1>

      <AnimatePresence mode="wait">
        {!cameraActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            key="start-screen">
            <Card className="max-w-md mx-auto border-none shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  Augmented Reality Scanner
                </CardTitle>
                <CardDescription>
                  Scan QR codes at heritage sites to view 3D models and
                  additional information.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground/50" />
                </div>

                <div className="flex flex-col w-full gap-3">
                  <Button
                    onClick={requestCameraPermission}
                    className="w-full rounded-full"
                    disabled={isLoading}>
                    <Camera className="mr-2 h-4 w-4" />
                    Scan QR Code with Camera
                  </Button>

                  <Button
                    onClick={triggerFileUpload}
                    variant="outline"
                    className="w-full rounded-full"
                    disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload QR Code Image
                  </Button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="w-full border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-3 text-center">
                      Or test AR World with a specific site:
                    </p>
                    <div className="flex gap-2">
                      {validSiteIds.slice(0, 3).map(id => (
                        <Link
                          key={id}
                          href={`/ar-world?siteId=${id}`}
                          className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2">
                            <Globe className="h-3 w-3" />
                            Site {id}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-500 text-center px-4 py-2 bg-red-50 rounded-md w-full">
                    {error}
                  </div>
                )}

                {cameraPermission === 'denied' && (
                  <div className="text-sm text-amber-600 text-center px-4 py-2 bg-amber-50 rounded-md w-full">
                    Camera access is blocked. Please update your browser
                    settings to allow camera access.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            key="camera-screen"
            className="max-w-md mx-auto">
            <div className="relative h-[70vh] w-full bg-black rounded-2xl overflow-hidden shadow-lg">
              {/* Video element for camera feed */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-10"
                playsInline
                muted
                autoPlay
              />

              {/* Canvas for QR code detection (hidden) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white">Activating camera...</p>
                  </div>
                </div>
              )}

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 rounded-full z-30"
                onClick={() => setCameraActive(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 text-sm text-center text-muted-foreground">
              <p>Position the QR code within the frame to scan</p>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-500 text-center px-4 py-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add the missing type to the global Window interface
declare global {
  interface Window {
    qrScanInterval: NodeJS.Timeout | null;
  }
}

// Update the startQrScanning function to be more reliable:
