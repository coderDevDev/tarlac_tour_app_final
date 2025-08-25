'use client';

import { Suspense } from 'react';
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

function ARCameraContent() {
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

  // Check camera permissions - enhanced for WebView compatibility
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        console.log('Checking camera permissions...');

        // Check if the browser supports the permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({
            name: 'camera' as PermissionName
          });

          console.log('Permission query result:', result.state);
          setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');

          // Listen for permission changes
          result.onchange = () => {
            console.log('Permission state changed to:', result.state);
            setCameraPermission(
              result.state as 'granted' | 'denied' | 'prompt'
            );
          };
        } else {
          console.log('Permissions API not supported, will request on demand');
          setCameraPermission('prompt');
        }
      } catch (err) {
        console.error('Error checking camera permissions:', err);
        // Fallback to prompt state if permission check fails
        setCameraPermission('prompt');
      }
    };

    checkPermissions();
  }, []);

  // Log camera permission status changes (but don't auto-start camera)
  useEffect(() => {
    console.log('Camera permission status changed:', cameraPermission);
  }, [cameraPermission]);

  // Debug: Log when video ref becomes available
  useEffect(() => {
    console.log('Video ref status:', {
      current: !!videoRef.current,
      element: videoRef.current,
      tagName: videoRef.current?.tagName
    });
  }, [videoRef.current]);

  // Handle camera activation - video element is always available now
  useEffect(() => {
    console.log('Camera activation effect:', {
      cameraActive,
      videoRef: !!videoRef.current
    });

    if (cameraActive) {
      // Start camera immediately since video element is always available
      console.log('Starting camera...');
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

      // Video element is always available now
      if (!videoRef.current) {
        console.error('Video element not available');
        throw new Error('Video element not available. Please try again.');
      }

      console.log('Video element found, setting up stream');

      // Set up video element
      videoRef.current.srcObject = null; // Clear any existing source
      videoRef.current.srcObject = stream;

      // Wait for video to be ready with better error handling
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element lost during setup'));
          return;
        }

        const video = videoRef.current;
        let resolved = false;

        const onCanPlay = () => {
          if (resolved) return;
          resolved = true;
          console.log('Video can play, attempting to play...');

          video
            .play()
            .then(() => {
              console.log('Video playing successfully');
              resolve();
            })
            .catch(err => {
              console.error('Error playing video:', err);
              // Don't reject - video might still work for scanning
              console.log('Video play failed but continuing...');
              resolve();
            });
        };

        const onLoadedMetadata = () => {
          console.log(
            'Video metadata loaded, dimensions:',
            video.videoWidth,
            'x',
            video.videoHeight
          );
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            onCanPlay();
          }
        };

        const onCanPlayThrough = () => {
          if (!resolved) {
            onCanPlay();
          }
        };

        // Multiple event listeners for better compatibility
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('canplaythrough', onCanPlayThrough);

        // Add timeout for video setup
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.warn('Video setup timeout, but continuing...');
            resolve();
          }
        }, 8000);

        // Cleanup function
        const cleanup = () => {
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('canplaythrough', onCanPlayThrough);
        };

        // Cleanup on resolve/reject
        const originalResolve = resolve;
        const originalReject = reject;

        resolve = () => {
          cleanup();
          originalResolve();
        };

        reject = (error: any) => {
          cleanup();
          originalReject(error);
        };
      });

      // Start QR scanning after camera is ready
      console.log('Camera ready, starting QR scanning...');
      setTimeout(() => {
        startQrScanning();
      }, 1000); // Small delay to ensure video is stable

      setCameraPermission('granted');
      setCameraActive(true);
      setError(null); // Clear any previous errors
      console.log('Camera started successfully!');
    } catch (err: any) {
      console.error('Error starting camera:', err);
      setError(
        err.message === 'Permission denied'
          ? 'Camera access was denied. Please allow camera access and try again.'
          : `Failed to start camera: ${err.message}`
      );
      setCameraPermission('denied');
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
    setCameraActive(false);
    setScanning(false);
  };

  // Request camera permission - more compatible with WebView
  const requestCameraPermission = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      console.log('Requesting camera permission...');

      // Add timeout to prevent hanging
      const permissionPromise = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920, min: 640 },
          height: { ideal: 720, max: 1080, min: 480 }
        },
        audio: false
      });

      // Add 10 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error('Permission request timeout - no response from device')
            ),
          10000
        );
      });

      // Race between permission request and timeout
      const stream = (await Promise.race([
        permissionPromise,
        timeoutPromise
      ])) as MediaStream;

      console.log('Camera permission granted, stream obtained:', stream);

      // Stop the test stream immediately
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        console.log('Stopping test track:', track);
        track.stop();
      });

      setCameraPermission('granted');

      // Don't auto-start camera - let user click "Start Camera" button
      console.log('Permission granted, camera ready to start');
      setError('Camera permission granted! Click "Start Camera" to begin.');
    } catch (err: any) {
      console.error('Error requesting camera permission:', err);

      if (err.message.includes('timeout')) {
        setError(
          'Permission request timed out. Please check if the permission dialog appeared and try again.'
        );
      } else if (
        err.name === 'NotAllowedError' ||
        err.message.includes('Permission denied')
      ) {
        setError(
          'Camera access was denied. Please allow camera access in your device settings and try again.'
        );
        setCameraPermission('denied');
      } else if (
        err.name === 'NotFoundError' ||
        err.message.includes('no camera')
      ) {
        setError(
          'No camera found on this device. Please check your camera hardware.'
        );
      } else if (err.name === 'NotReadableError') {
        setError(
          'Camera is in use by another application. Please close other camera apps and try again.'
        );
      } else {
        setError(`Failed to get camera permission: ${err.message || err.name}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Start QR scanning with better camera availability checks
  const startQrScanning = async () => {
    setScanning(true);
    setError(null);

    try {
      // Check if camera is actually available
      if (!videoRef.current || !canvasRef.current) {
        throw new Error('Camera elements not ready');
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Wait for video to be ready
      if (video.readyState < video.HAVE_METADATA) {
        console.log('Waiting for video to be ready...');
        await new Promise<void>(resolve => {
          const checkReady = () => {
            if (video.readyState >= video.HAVE_METADATA) {
              resolve();
            } else {
              setTimeout(checkReady, 100);
            }
          };
          checkReady();
        });
      }

      // Check video dimensions
      if (!video.videoWidth || !video.videoHeight) {
        throw new Error('Video dimensions not available');
      }

      console.log('Video ready for scanning:', {
        width: video.videoWidth,
        height: video.videoHeight,
        readyState: video.readyState
      });

      // Dynamically import jsQR
      const jsQRModule = await import('jsqr');
      const jsQR = jsQRModule.default;
      console.log('jsQR loaded successfully');

      // Clear any existing interval
      if (window.qrScanInterval) {
        clearInterval(window.qrScanInterval);
      }

      // Create a scanning interval with better error handling
      window.qrScanInterval = setInterval(() => {
        try {
          if (!videoRef.current || !canvasRef.current) {
            console.warn('Video or canvas refs lost during scanning');
            return;
          }

          const currentVideo = videoRef.current;
          const currentCanvas = canvasRef.current;

          // Check if video is still valid
          if (currentVideo.readyState < currentVideo.HAVE_ENOUGH_DATA) {
            return; // Skip this frame
          }

          // Check if dimensions are still valid
          if (!currentVideo.videoWidth || !currentVideo.videoHeight) {
            console.warn('Video dimensions lost during scanning');
            return;
          }

          // Set canvas dimensions to match video
          currentCanvas.width = currentVideo.videoWidth;
          currentCanvas.height = currentVideo.videoHeight;

          // Draw video frame to canvas
          const ctx = currentCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              currentVideo,
              0,
              0,
              currentCanvas.width,
              currentCanvas.height
            );

            // Get image data for QR code detection
            const imageData = ctx.getImageData(
              0,
              0,
              currentCanvas.width,
              currentCanvas.height
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
              // Stop scanning and process the QR code
              if (window.qrScanInterval) {
                clearInterval(window.qrScanInterval);
                window.qrScanInterval = null;
              }
              setScanning(false);
              processQrCode(code.data);
            }
          }
        } catch (scanError) {
          console.error('Error during QR scanning:', scanError);
          // Don't stop scanning for individual frame errors
        }
      }, 300); // Scan every 300ms for better performance

      console.log('QR scanning started successfully');
    } catch (err: any) {
      console.error('Error starting QR scanning:', err);
      setError(
        `Failed to initialize QR scanner: ${err.message}. Please try uploading an image instead.`
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

      // Detect QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        console.log('QR code detected from file:', code.data);
        processQrCode(code.data);
      } else {
        setError('No QR code found in the uploaded image');
      }
    } catch (err: any) {
      console.error('Error processing uploaded image:', err);
      setError(`Failed to process image: ${err.message}`);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Process QR code
  const processQrCode = (qrData: string) => {
    console.log('Processing QR code:', qrData);

    // Try to parse the QR code data
    try {
      // Check if it's a valid site ID
      const siteId = qrData.trim();

      console.log({ siteId });
      if (validSiteIds.includes(siteId)) {
        console.log('Valid site ID found, navigating to AR viewer');
        router.push(`/ar-world?siteId=${siteId}`);
      } else {
        setError(`Invalid site ID: ${siteId}. Please scan a valid QR code.`);
      }
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Invalid QR code format. Please scan a valid QR code.');
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

      {/* Always render video element but hide when not needed */}
      <div className="hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Camera Status Indicator */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Camera Status</span>
            <div
              className={`w-3 h-3 rounded-full ${
                cameraActive && streamRef.current
                  ? 'bg-green-500 animate-pulse'
                  : cameraActive
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-400'
              }`}></div>
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Permission:</span>
              <span
                className={`${
                  cameraPermission === 'granted'
                    ? 'text-green-600'
                    : cameraPermission === 'denied'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                {cameraPermission === 'granted'
                  ? '✓ Granted'
                  : cameraPermission === 'denied'
                  ? '✗ Denied'
                  : '? Prompt'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Camera:</span>
              <span
                className={cameraActive ? 'text-green-600' : 'text-gray-500'}>
                {cameraActive ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Stream:</span>
              <span
                className={
                  streamRef.current ? 'text-green-600' : 'text-gray-500'
                }>
                {streamRef.current ? '✓ Available' : '✗ Not Available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Scanning:</span>
              <span className={scanning ? 'text-green-600' : 'text-gray-500'}>
                {scanning ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                  {/* Permission Status Display */}
                  <div className="text-xs text-center p-2 rounded-lg bg-muted/50">
                    <span className="font-medium">Camera Permission: </span>
                    <span
                      className={`${
                        cameraPermission === 'granted'
                          ? 'text-green-600'
                          : cameraPermission === 'denied'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                      {cameraPermission === 'granted'
                        ? '✓ Granted'
                        : cameraPermission === 'denied'
                        ? '✗ Denied'
                        : '? Prompt'}
                    </span>
                  </div>

                  <Button
                    onClick={
                      cameraPermission === 'granted'
                        ? startCamera
                        : requestCameraPermission
                    }
                    className="w-full rounded-full"
                    disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {cameraPermission === 'granted'
                          ? 'Starting Camera...'
                          : 'Requesting Permission...'}
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        {cameraPermission === 'granted'
                          ? 'Start Camera'
                          : 'Request Camera Permission'}
                      </>
                    )}
                  </Button>

                  {/* Debug: Direct permission test */}
                  <Button
                    onClick={async () => {
                      try {
                        console.log('Testing direct permission request...');
                        const stream =
                          await navigator.mediaDevices.getUserMedia({
                            video: true
                          });
                        console.log('Direct permission success:', stream);
                        stream.getTracks().forEach(track => track.stop());
                        setError('Direct permission test successful!');
                      } catch (err: any) {
                        console.error('Direct permission test failed:', err);
                        setError(
                          `Direct test failed: ${err.message || err.name}`
                        );
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs">
                    Test Direct Permission
                  </Button>

                  {/* Debug: Check WebView environment */}
                  <Button
                    onClick={() => {
                      const info = {
                        userAgent: navigator.userAgent,
                        platform: navigator.platform,
                        vendor: navigator.vendor,
                        mediaDevices: !!navigator.mediaDevices,
                        permissions: !!navigator.permissions,
                        webView:
                          navigator.userAgent.includes('wv') ||
                          navigator.userAgent.includes('WebView'),
                        location: location.href,
                        protocol: location.protocol
                      };
                      console.log('WebView Environment Info:', info);
                      setError(
                        `WebView: ${info.webView}, HTTPS: ${
                          info.protocol === 'https:'
                        }, MediaDevices: ${info.mediaDevices}`
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs">
                    Check Environment
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

                {/* Debug Information */}
                <details className="w-full">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Debug Info
                  </summary>
                  <div className="text-xs text-left mt-2 p-2 bg-muted/30 rounded space-y-1">
                    <div>
                      User Agent: {navigator.userAgent.substring(0, 50)}...
                    </div>
                    <div>
                      HTTPS: {location.protocol === 'https:' ? 'Yes' : 'No'}
                    </div>
                    <div>
                      MediaDevices:{' '}
                      {navigator.mediaDevices ? 'Supported' : 'Not Supported'}
                    </div>
                    <div>
                      Permissions API:{' '}
                      {navigator.permissions ? 'Supported' : 'Not Supported'}
                    </div>
                    <div>Camera Permission: {cameraPermission}</div>
                    <div>Camera Active: {cameraActive ? 'Yes' : 'No'}</div>
                  </div>
                </details>
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

              {/* Camera starting overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white">Starting camera...</p>
                  </div>
                </div>
              )}

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
                <p className="mb-2">{error}</p>
                <Button
                  onClick={() => {
                    setError(null);
                    setCameraActive(false);
                    setTimeout(() => setCameraActive(true), 100);
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2">
                  Retry Camera
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ARCameraPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="font-medium">Loading AR Camera...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we prepare your camera experience
          </p>
        </div>
      }>
      <ARCameraContent />
    </Suspense>
  );
}

// Add the missing type to the global Window interface
declare global {
  interface Window {
    qrScanInterval: NodeJS.Timeout | null;
  }
}
