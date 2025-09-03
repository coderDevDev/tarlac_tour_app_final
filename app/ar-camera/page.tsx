'use client';

import type React from 'react';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Camera,
  X,
  Upload,
  RefreshCw,
  Globe,
  Info,
  RotateCcw,
  Hand
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getSiteById, getAllSiteIds } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Html,
  useAnimations,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';

declare global {
  interface Window {
    qrScanInterval?: NodeJS.Timeout | null;
  }
}

// AR Model Component for overlay
function ARModelOverlay({
  url,
  position = [0, 0, 0],
  scale = 1.5,
  onModelReady,
  onModelLoading
}: {
  url: string;
  position?: [number, number, number];
  scale?: number;
  onModelReady?: () => void;
  onModelLoading?: () => void;
}) {
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Notify parent that model is loading
    onModelLoading?.();

    // Play the first animation if available
    if (animations.length > 0 && actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }

    // Pass ref back to parent when ready
    if (groupRef.current) {
      console.log('AR Model Overlay ready:', url);
      // Notify parent that model is ready
      onModelReady?.();
    }

    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, [actions, animations, mixer, url, onModelReady, onModelLoading]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive
        ref={meshRef}
        object={scene}
        onPointerOver={(e: any) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e: any) => {
          document.body.style.cursor = 'default';
        }}
      />

      {/* Simple indicator that model is ready */}
      <Html position={[0, 1, 0]}>
        <div className="bg-green-500/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
          ✓ Model Ready
        </div>
      </Html>
    </group>
  );
}

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
  const [arMode, setArMode] = useState(false); // New: AR overlay mode
  const [currentSite, setCurrentSite] = useState<any>(null); // New: Current site for AR
  const [modelLoading, setModelLoading] = useState(false); // New: Model loading state
  const [modelReady, setModelReady] = useState(false); // New: Model ready state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const site = siteId ? getSiteById(siteId) : null;
  const validSiteIds = getAllSiteIds();

  // Check camera permissions and auto-start camera if siteId is provided
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({
            name: 'camera' as PermissionName
          });
          setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');

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

    // Auto-start camera and AR mode if siteId is provided (coming from site page)
    if (siteId && site) {
      console.log(
        'SiteId provided, auto-starting camera and AR mode for direct AR experience'
      );
      console.log('Site data:', site);
      console.log('SiteId:', siteId);

      // First priority: Start camera immediately
      console.log('Auto-starting camera for site:', site.name);
      autoStartCamera();

      // Second priority: Set up AR mode after camera is ready
      setCurrentSite(site);
      console.log('Site set for AR mode:', site.name);

      // Don't enable AR mode yet - wait for camera to be ready
      console.log('Camera will be activated first, AR mode will follow');
    }
  }, [siteId, site]);

  // Handle camera activation - consolidated logic
  useEffect(() => {
    console.log(
      'Camera activation useEffect triggered, cameraActive:',
      cameraActive
    );
    if (cameraActive) {
      console.log('Camera activation requested, starting camera...');
      const timer = setTimeout(() => {
        console.log('Timer fired, calling startCamera()');
        startCamera();
      }, 100);

      return () => {
        console.log('Clearing camera start timer');
        clearTimeout(timer);
      };
    } else {
      console.log('Camera not active, stopping camera');
      stopCamera();
    }

    return () => {
      console.log('Camera activation useEffect cleanup');
      stopCamera();
    };
  }, [cameraActive]);

  // Enable AR mode after camera is successfully started
  useEffect(() => {
    if (cameraActive && currentSite && !arMode) {
      console.log(
        'Camera is active, now enabling AR mode for:',
        currentSite.name
      );
      // Small delay to ensure camera is fully ready
      setTimeout(() => {
        setArMode(true);
        setModelLoading(true);
        setModelReady(false);
        console.log('AR mode enabled for site:', currentSite.name);
      }, 1000); // 1 second delay to ensure camera is stable
    }
  }, [cameraActive, currentSite, arMode]);

  // Start the camera
  const startCamera = async () => {
    console.log('startCamera called - setting up camera...');
    setError(null);
    setIsLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      if (!videoRef.current) {
        console.log(
          'Video element not found, waiting for it to be available...'
        );
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!videoRef.current) {
          throw new Error('Video element not found');
        }
      }

      console.log('Video element found, requesting camera access...');

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log('Requesting camera access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      console.log('Camera access granted, setting up video element');

      streamRef.current = stream;

      if (!videoRef.current) {
        throw new Error('Video element not found after camera access granted');
      }

      videoRef.current.srcObject = null;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded, playing video');
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              console.log('Video playing successfully');
              startQrScanning();
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setError(`Error displaying camera feed: ${err.message}`);
            });
        }
      };

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

    if (typeof window !== 'undefined' && window.qrScanInterval) {
      clearInterval(window.qrScanInterval);
      window.qrScanInterval = null;
    }

    // Exit AR mode when stopping camera
    setArMode(false);
    setCurrentSite(null);
  };

  // Start scanning for QR codes
  const startQrScanning = async () => {
    setScanning(true);
    console.log('Starting enhanced QR code scanning');

    try {
      let jsQR: any;
      try {
        const jsQRModule = await import('jsqr');
        jsQR = jsQRModule.default || jsQRModule;
        console.log('jsQR loaded successfully');
      } catch (importError) {
        console.error('Failed to import jsQR:', importError);
        throw new Error('Failed to load QR scanner library');
      }

      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      if (window.qrScanInterval) {
        clearInterval(window.qrScanInterval);
        window.qrScanInterval = null;
      }

      // Enhanced scanning with multiple strategies
      let lastScanTime = 0;
      let consecutiveFailures = 0;
      let scanAttempts = 0;
      let lastFrameTime = 0;
      const targetFPS = 10; // Limit to 10 FPS for better performance
      const frameInterval = 1000 / targetFPS;

      window.qrScanInterval = setInterval(() => {
        const now = Date.now();

        // Frame rate limiting for better performance
        if (now - lastFrameTime < frameInterval) {
          return;
        }
        lastFrameTime = now;

        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;

          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (videoWidth && videoHeight) {
              // Optimize canvas size for better performance
              const targetWidth = Math.min(videoWidth, 640);
              const targetHeight = Math.min(videoHeight, 480);

              // Only resize canvas if dimensions changed
              if (
                canvas.width !== targetWidth ||
                canvas.height !== targetHeight
              ) {
                canvas.width = targetWidth;
                canvas.height = targetHeight;
              }

              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Enhanced image processing for better QR detection
                ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

                // Try multiple scanning strategies
                const strategies = [
                  // Strategy 1: Full image scan
                  () => {
                    const imageData = ctx.getImageData(
                      0,
                      0,
                      targetWidth,
                      targetHeight
                    );
                    return jsQR(
                      imageData.data,
                      imageData.width,
                      imageData.height,
                      {
                        inversionAttempts: 'dontInvert'
                      }
                    );
                  },
                  // Strategy 2: Center region scan (most common QR placement)
                  () => {
                    const centerX = Math.floor(targetWidth / 2);
                    const centerY = Math.floor(targetHeight / 2);
                    const regionSize = Math.min(targetWidth, targetHeight) / 2;

                    const x = Math.max(0, centerX - regionSize / 2);
                    const y = Math.max(0, centerY - regionSize / 2);
                    const width = Math.min(regionSize, targetWidth - x);
                    const height = Math.min(regionSize, targetHeight - y);

                    const imageData = ctx.getImageData(x, y, width, height);
                    return jsQR(
                      imageData.data,
                      imageData.width,
                      imageData.height,
                      {
                        inversionAttempts: 'dontInvert'
                      }
                    );
                  },
                  // Strategy 3: Multiple smaller regions for better coverage
                  () => {
                    const regions = [
                      { x: 0, y: 0, w: targetWidth / 2, h: targetHeight / 2 },
                      {
                        x: targetWidth / 2,
                        y: 0,
                        w: targetWidth / 2,
                        h: targetHeight / 2
                      },
                      {
                        x: 0,
                        y: targetHeight / 2,
                        w: targetWidth / 2,
                        h: targetHeight / 2
                      },
                      {
                        x: targetWidth / 2,
                        y: targetHeight / 2,
                        w: targetWidth / 2,
                        h: targetHeight / 2
                      }
                    ];

                    for (const region of regions) {
                      const imageData = ctx.getImageData(
                        region.x,
                        region.y,
                        region.w,
                        region.h
                      );
                      const code = jsQR(
                        imageData.data,
                        imageData.width,
                        imageData.height,
                        {
                          inversionAttempts: 'dontInvert'
                        }
                      );
                      if (code) return code;
                    }
                    return null;
                  }
                ];

                // Try each strategy until we find a QR code
                let code = null;
                for (const strategy of strategies) {
                  try {
                    code = strategy();
                    if (code) break;
                  } catch (err) {
                    console.warn('Strategy failed:', err);
                    continue;
                  }
                }

                if (code) {
                  const now = Date.now();
                  scanAttempts++;

                  // Prevent duplicate scans within 1 second
                  if (now - lastScanTime > 1000) {
                    console.log(
                      'QR code detected:',
                      code.data,
                      'in',
                      scanAttempts,
                      'attempts'
                    );
                    lastScanTime = now;
                    consecutiveFailures = 0;
                    processQrCode(code.data);
                  }
                } else {
                  consecutiveFailures++;
                  scanAttempts++;

                  // Adaptive scanning frequency based on failure rate
                  if (consecutiveFailures > 50) {
                    // Slow down scanning if we're not finding anything
                    clearInterval(window.qrScanInterval!);
                    window.qrScanInterval = setInterval(() => {
                      // Restart with faster scanning
                      consecutiveFailures = 0;
                      startQrScanning();
                    }, 1000);
                  }
                }
              }
            }
          }
        }
      }, 100); // Increased frequency from 200ms to 100ms for faster detection

      console.log('Enhanced QR scanning started with 100ms intervals');
    } catch (err) {
      console.error('Error starting enhanced QR scanning:', err);
      setError(
        'Failed to initialize enhanced QR scanner. Please try uploading an image instead.'
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
      let jsQR: any;
      try {
        const jsQRModule = await import('jsqr');
        jsQR = jsQRModule.default || jsQRModule;
      } catch (importError) {
        console.error('Failed to import jsQR:', importError);
        throw new Error('Failed to load QR scanner library');
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise(resolve => {
        img.onload = resolve;
      });

      // Enhanced image processing with multiple strategies
      const strategies = [
        // Strategy 1: Full image scan
        () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return null;

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          return jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });
        },
        // Strategy 2: Optimized size for better performance
        () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return null;

          // Optimize canvas size for better QR detection
          const maxSize = 1024;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          const targetWidth = Math.floor(img.width * scale);
          const targetHeight = Math.floor(img.height * scale);

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          context.drawImage(img, 0, 0, targetWidth, targetHeight);

          const imageData = context.getImageData(
            0,
            0,
            targetWidth,
            targetHeight
          );
          return jsQR(imageData.data, targetWidth, targetHeight, {
            inversionAttempts: 'dontInvert'
          });
        },
        // Strategy 3: Multiple region scans for better coverage
        () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return null;

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          // Try different regions of the image
          const regions = [
            { x: 0, y: 0, w: img.width, h: img.height }, // Full image
            {
              x: img.width * 0.1,
              y: img.height * 0.1,
              w: img.width * 0.8,
              h: img.height * 0.8
            }, // Center 80%
            {
              x: img.width * 0.2,
              y: img.height * 0.2,
              w: img.width * 0.6,
              h: img.height * 0.6
            } // Center 60%
          ];

          for (const region of regions) {
            const imageData = context.getImageData(
              region.x,
              region.y,
              region.w,
              region.h
            );
            const code = jsQR(imageData.data, region.w, region.h, {
              inversionAttempts: 'dontInvert'
            });
            if (code) return code;
          }
          return null;
        }
      ];

      // Try each strategy until we find a QR code
      let code = null;
      for (const strategy of strategies) {
        try {
          code = strategy();
          if (code) break;
        } catch (err) {
          console.warn('Strategy failed:', err);
          continue;
        }
      }

      if (code) {
        console.log('QR code detected in uploaded image:', code.data);
        processQrCode(code.data);
      } else {
        setError(
          'No QR code found in the image. Please try another image or ensure the QR code is clearly visible.'
        );
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

  // Process QR code data - Enhanced to enable AR mode
  const processQrCode = (data: string) => {
    try {
      let extractedSiteId: string | null = null;

      if (data.includes('/ar-camera?siteId=')) {
        try {
          const url = new URL(data);
          extractedSiteId = url.searchParams.get('siteId');
        } catch (e) {
          const match = data.match(/\/ar-camera\?siteId=([^&]+)/);
          if (match && match[1]) {
            extractedSiteId = match[1];
          }
        }
      } else if (data.startsWith('/ar-camera?siteId=')) {
        const params = new URLSearchParams(data.split('?')[1]);
        extractedSiteId = params.get('siteId');
      } else if (validSiteIds.includes(data)) {
        extractedSiteId = data;
      }

      if (extractedSiteId && validSiteIds.includes(extractedSiteId)) {
        const site = getSiteById(extractedSiteId);
        if (site) {
          console.log('Site detected, enabling AR mode:', site.name);

          // Stop scanning but keep camera active
          setScanning(false);

          // Enable AR mode with the detected site
          setCurrentSite(site);
          setArMode(true);

          // Set model loading state
          setModelLoading(true);
          setModelReady(false);

          // Show success message
          setError(null);
        } else {
          setError(
            'Site not found. Please scan a valid heritage site QR code.'
          );
        }
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

      setCameraActive(true);
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setError('Failed to request camera permission. Please try again.');
    }
  };

  // Auto-start camera for direct AR experience (when coming from site page)
  const autoStartCamera = async () => {
    try {
      console.log('Auto-starting camera for direct AR experience...');

      // First try to get camera permission directly
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          console.log('Requesting camera permission directly...');
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });

          console.log('Camera permission granted, setting up video...');
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setCameraPermission('granted');
            setCameraActive(true);
            console.log('Camera auto-started successfully');
          }
        } catch (permissionError) {
          console.log(
            'Direct permission request failed, falling back to normal flow:',
            permissionError
          );
          setCameraActive(true);
        }
      } else {
        console.log('MediaDevices not available, using normal flow');
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error auto-starting camera:', err);
      setError('Failed to auto-start camera. Please try manually.');
    }
  };

  // Exit AR mode and return to scanning
  const exitArMode = () => {
    setArMode(false);
    setCurrentSite(null);
    setModelLoading(false);
    setModelReady(false);
    setScanning(true);
    startQrScanning();
  };

  // If a siteId is provided via URL, show the AR viewer for that site
  if (siteId && site) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AR Experience: {site.name}</h1>
          {/* <Button
            variant="outline"
            onClick={() => router.push('/ar-camera')}
            className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Close AR
          </Button> */}
        </div>

        <div className="h-[70vh] bg-black/5 rounded-2xl overflow-hidden shadow-lg">
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 5], fov: 75 }}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} />
            <pointLight position={[0, 5, 5]} intensity={1.0} />

            <ARModelOverlay url={site.modelUrl || '/models/placeholder.glb'} />

            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
              target={[0, 0, 0]}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Canvas>
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>
            Move your device around to explore the 3D model. Use touch gestures
            to interact.
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

      {/* Camera and AR Overlay Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Camera Feed - Always rendered but conditionally visible */}
        <video
          ref={videoRef}
          className={`${
            cameraActive
              ? 'absolute inset-0 w-full h-full object-cover z-10 rounded-2xl'
              : 'hidden'
          }`}
          playsInline
          muted
          autoPlay
          style={{
            objectFit: 'cover',
            pointerEvents: 'none', // Prevent video from capturing touch events
            touchAction: 'none',
            userSelect: 'none'
          }}
        />

        {/* Hidden canvas for QR scanning */}
        <canvas ref={canvasRef} className="hidden" />

        {/* AR Overlay - 3D Models over Camera */}
        {arMode && currentSite && cameraActive && (
          <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden">
            {/* Model Loading Overlay */}
            {modelLoading && !modelReady && (
              <div className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">
                    Loading 3D Model
                  </h3>
                  <p className="text-sm text-gray-300 max-w-xs">
                    Preparing {currentSite.name} for AR experience...
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Loading model assets...</span>
                  </div>
                </div>
              </div>
            )}

            <Canvas
              style={{
                width: '100%',
                height: '100%',
                touchAction: 'none',
                userSelect: 'none'
              }}
              camera={{ position: [0, 0, 8], fov: 60 }}
              gl={{
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true
              }}>
              <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />

              {/* Enhanced Lighting Setup */}
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2.5} />
              <pointLight position={[0, 5, 5]} intensity={1.0} />
              <hemisphereLight args={[0xffffff, 0x444444, 0.8]} />

              {/* 3D Model Overlay */}
              <ARModelOverlay
                url={currentSite.modelUrl || '/models/placeholder.glb'}
                position={[0, 0, 0]}
                scale={1.5}
                onModelLoading={() => setModelLoading(true)}
                onModelReady={() => {
                  setModelLoading(false);
                  setModelReady(true);
                }}
              />

              {/* Debug Grid to help visualize 3D space */}
              <gridHelper args={[8, 8, 0x444444, 0x888888]} />

              {/* Subtle background elements for better AR visualization */}
              <mesh position={[0, 0, -3]} rotation={[0, 0, 0]}>
                <planeGeometry args={[16, 16]} />
                <meshBasicMaterial color={0x000000} transparent opacity={0.1} />
              </mesh>

              {/* OrbitControls for touch interaction */}
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={15}
                target={[0, 0, 0]}
                enableDamping={true}
                dampingFactor={0.05}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 6}
              />

              {/* AR Crosshair for better visual feedback */}
              <Html center>
                <div className="w-16 h-16 border-2 border-white/30 rounded-full relative pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full"></div>
                </div>
              </Html>
            </Canvas>
          </div>
        )}

        {/* AR Mode Status Bar */}
        {arMode && currentSite && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-4 right-4 z-30 bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full border ${
                    modelReady
                      ? 'bg-green-500/20 border-green-400/30'
                      : 'bg-blue-500/20 border-blue-400/30'
                  }`}>
                  {modelReady ? (
                    <Globe className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">
                    {currentSite.name}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {modelReady
                      ? 'AR Mode Active - Touch to interact with 3D model'
                      : 'Loading 3D model...'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={exitArMode}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:bg-white/30 transition-colors">
                Exit AR
              </Button>
            </div>
          </motion.div>
        )}

        {/* Touch Instructions for AR Mode */}
        {/* {arMode && currentSite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-4 left-4 right-4 z-30">
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                  <Hand className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-white">
                  Touch Gestures
                </span>
              </div>
              <div className="text-xs text-gray-300 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>
                    <strong>One finger:</strong> Move the 3D model
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>
                    <strong>Two fingers:</strong> Rotate the model
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Pinch:</strong> Zoom in/out
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Model Loading Status - Bottom Center */}
        {arMode && currentSite && modelLoading && !modelReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-4 left-4 right-4 z-30">
            <div className="bg-blue-500/90 backdrop-blur-md rounded-xl p-4 text-center border border-blue-400/30">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-sm font-medium text-white">
                  Loading 3D Model
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Please wait while we prepare {currentSite.name} for AR
                experience...
              </p>
            </div>
          </motion.div>
        )}

        {/* Touch Instructions - Only show when model is ready */}
        {/* {arMode && currentSite && modelReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-4 left-4 right-4 z-30">
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-2 bg-green-500/20 rounded-full border border-green-400/30">
                  <Hand className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-sm font-medium text-white">
                  Touch Gestures
                </span>
              </div>
              <div className="text-xs text-gray-300 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>
                    <strong>One finger:</strong> Move the 3D model
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>
                    <strong>Two fingers:</strong> Rotate the model
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Pinch:</strong> Zoom in/out
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )} */}

        {/* Camera Controls */}
        {cameraActive && (
          <div className="absolute top-4 right-4 z-30">
            <Button
              size="icon"
              variant="secondary"
              onClick={stopCamera}
              className="bg-black/50 hover:bg-black/70 text-white border-white/30 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-40 rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white">Activating camera...</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-20 left-4 right-4 z-30">
            <div className="bg-red-500/90 text-white px-4 py-3 rounded-lg text-center">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content - Start Screen or Camera Interface */}
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
                    {siteId && site
                      ? `AR Experience: ${site.name}`
                      : 'Augmented Reality Scanner'}
                  </CardTitle>
                  <CardDescription>
                    {siteId && site
                      ? `Starting camera for ${site.name}. AR experience will load after camera is ready.`
                      : 'Scan QR codes at heritage sites to view 3D models overlaid on the real world.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                  <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center">
                    <Camera className="h-16 w-16 text-muted-foreground/50" />
                  </div>

                  <div className="flex flex-col w-full gap-3">
                    {siteId && site ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>
                            {cameraActive
                              ? 'Loading 3D Model...'
                              : 'Starting Camera...'}
                          </span>
                        </div>
                        <Button
                          onClick={autoStartCamera}
                          variant="outline"
                          className="w-full rounded-full"
                          disabled={isLoading}>
                          <Camera className="mr-2 h-4 w-4" />
                          Retry Camera Start
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={requestCameraPermission}
                        className="w-full rounded-full"
                        disabled={isLoading}>
                        <Camera className="mr-2 h-4 w-4" />
                        Scan QR Code with Camera
                      </Button>
                    )}

                    {/* <Button
                      onClick={triggerFileUpload}
                      variant="outline"
                      className="w-full rounded-full bg-transparent"
                      disabled={isLoading}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload QR Code Image
                    </Button> */}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {(isLoading || (siteId && site && !cameraActive)) && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>
                        {siteId && site && !cameraActive
                          ? 'Starting Camera...'
                          : siteId && site && cameraActive && !arMode
                          ? 'Camera Ready - Loading AR Mode...'
                          : 'Processing...'}
                      </span>
                    </div>
                  )}

                  {/* Debug info for auto-start */}
                  {siteId && site && (
                    <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
                      <p>Site: {site.name}</p>
                      <p>Camera Active: {cameraActive ? 'Yes' : 'No'}</p>
                      <p>AR Mode: {arMode ? 'Yes' : 'No'}</p>
                      <p>Model Loading: {modelLoading ? 'Yes' : 'No'}</p>
                      <p>Model Ready: {modelReady ? 'Yes' : 'No'}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('Manual camera start clicked');
                            setCameraActive(true);
                          }}
                          className="text-xs">
                          Start Camera
                        </Button>
                        {cameraActive && !arMode && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('Manual AR mode start clicked');
                              setArMode(true);
                              setModelLoading(true);
                              setModelReady(false);
                            }}
                            className="text-xs">
                            Start AR
                          </Button>
                        )}
                      </div>
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
              className="h-[70vh] w-full bg-black rounded-2xl overflow-hidden shadow-lg">
              {/* Scanning overlay - only show when not in AR mode */}
              {!arMode && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

                      {/* Enhanced scanning indicator */}
                      {scanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 border-2 border-blue-400/60 rounded-lg relative animate-pulse">
                            <div className="absolute inset-0 border-2 border-blue-300/40 rounded-lg animate-ping"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
                      <p className="text-white text-sm font-medium">
                        {scanning
                          ? 'Scanning for QR codes...'
                          : 'Position QR code in frame'}
                      </p>
                      {scanning && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-300">
                            Active scanning
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
