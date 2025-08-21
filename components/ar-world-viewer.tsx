'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Html,
  useAnimations,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Info,
  RotateCcw,
  X,
  Camera,
  Globe,
  Target,
  RefreshCw
} from 'lucide-react';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  position?: [number, number, number];
}

function ARModel({ url, position = [0, 0, 0] }: ModelProps) {
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Play the first animation if available
    if (animations.length > 0 && actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }

    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, [actions, animations, mixer]);

  return (
    <primitive ref={meshRef} object={scene} scale={1.5} position={position} />
  );
}

interface ARWorldViewerProps {
  modelUrl: string;
  siteName: string;
}

export default function ARWorldViewer({
  modelUrl,
  siteName
}: ARWorldViewerProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [placedModels, setPlacedModels] = useState<
    Array<{
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
    }>
  >([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check AR support and camera permissions
  useEffect(() => {
    // Check for WebXR support
    if (navigator.xr) {
      navigator.xr
        .isSessionSupported('immersive-ar')
        .then(supported => {
          setArSupported(supported);
        })
        .catch(() => {
          setArSupported(false);
        });
    } else {
      setArSupported(false);
    }

    // Check camera permissions on mobile
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          console.log('Camera permission status:', permissionStatus.state);
          if (permissionStatus.state === 'denied') {
            console.warn('Camera permission denied');
          }
        })
        .catch(err => {
          console.log('Permission query not supported:', err);
        });
    }
  }, []);

  const handlePlaceModel = useCallback(
    (hit: THREE.Vector3, normal: THREE.Vector3) => {
      const newModel = {
        id: Date.now().toString(),
        position: [hit.x, hit.y, hit.z] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number]
      };
      setPlacedModels(prev => [...prev, newModel]);
    },
    []
  );

  const removeModel = (id: string) => {
    setPlacedModels(prev => prev.filter(model => model.id !== id));
  };

  const resetModels = () => {
    setPlacedModels([]);
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');

      // Check if video ref exists before proceeding
      if (!videoRef.current) {
        console.error(
          'Video ref not found - waiting for ref to be available...'
        );
        // Wait a bit for the ref to be set
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!videoRef.current) {
          console.error('Video ref still not available after delay');
          throw new Error('Video element not found');
        }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Mobile-optimized camera settings
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            aspectRatio: { ideal: 16 / 9 }
          },
          audio: false
        };

        console.log('Requesting camera with constraints:', constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log('Camera stream obtained:', stream);
        setCameraStream(stream);
        setCameraActive(true);

        // Set up video element with mobile-specific handling
        if (videoRef.current) {
          const video = videoRef.current;

          // Mobile-specific video attributes
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('muted', 'true');
          video.setAttribute('autoplay', 'true');

          video.srcObject = stream;

          // Handle video loading and playing
          const playVideo = async () => {
            try {
              console.log('Attempting to play video...');
              await video.play();
              console.log('Video playing successfully');
            } catch (playError) {
              console.error('Play error:', playError);
              // Try again after a short delay (mobile workaround)
              setTimeout(async () => {
                try {
                  await video.play();
                  console.log('Video playing after retry');
                } catch (retryError) {
                  console.error('Retry failed:', retryError);
                }
              }, 100);
            }
          };

          // Multiple event handlers for mobile compatibility
          video.onloadedmetadata = () => {
            console.log(
              'Video metadata loaded, dimensions:',
              video.videoWidth,
              'x',
              video.videoHeight
            );
            playVideo();
          };

          video.oncanplay = () => {
            console.log('Video can play, attempting to play...');
            playVideo();
          };

          video.onloadeddata = () => {
            console.log('Video data loaded');
            playVideo();
          };

          // Force play on user interaction (mobile requirement)
          const forcePlay = () => {
            if (video.paused) {
              playVideo();
            }
          };

          // Add click listener to force play
          video.addEventListener('click', forcePlay);
          video.addEventListener('touchstart', forcePlay);
        } else {
          console.error('Video ref not found');
        }

        return stream;
      } else {
        console.error('getUserMedia not supported');
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      // Fallback: still show the interface even if camera fails
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  // Handle touch/click to place models
  const handleContainerClick = (event: React.MouseEvent) => {
    if (!cameraActive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Place model at calculated position - make it more visible
    const newModel = {
      id: Date.now().toString(),
      position: [x * 1.5, -y * 1.5, -1] as [number, number, number], // Much closer for visibility
      rotation: [0, 0, 0] as [number, number, number]
    };

    console.log('Placing model at:', newModel.position, 'from click at:', {
      x: event.clientX,
      y: event.clientY
    });
    setPlacedModels(prev => [...prev, newModel]);

    // Visual feedback
    const feedback = document.createElement('div');
    feedback.className =
      'absolute w-4 h-4 bg-green-500 rounded-full pointer-events-none animate-ping';
    feedback.style.left = `${event.clientX - 8}px`;
    feedback.style.top = `${event.clientY - 8}px`;
    feedback.style.zIndex = '1000';
    document.body.appendChild(feedback);

    setTimeout(() => {
      if (document.body.contains(feedback)) {
        document.body.removeChild(feedback);
      }
    }, 1000);
  };

  // Debug info
  useEffect(() => {
    console.log('AR World Viewer State:', {
      arSupported,
      cameraActive,
      placedModelsCount: placedModels.length,
      showInfo
    });

    if (cameraActive) {
      console.log('Camera active, models count:', placedModels.length);
    }
  }, [arSupported, cameraActive, placedModels.length, showInfo]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Ensure video ref is available
  useEffect(() => {
    if (videoRef.current) {
      console.log('Video ref initialized:', videoRef.current);
    } else {
      console.log('Video ref not yet available');
    }
  }, []);

  if (!arSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="mb-4 p-4 bg-yellow-100 rounded-full">
          <Info className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">AR Not Supported</h3>
        <p className="text-muted-foreground mb-4">
          Your device doesn't support WebXR AR features. Try using a modern
          smartphone with AR capabilities.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button onClick={startCamera} className="gap-2">
            <Camera className="h-4 w-4" />
            Try Camera Mode
          </Button>
        </div>
      </div>
    );
  }

  // Debug: Always show camera mode for testing
  console.log('AR Support Check:', { arSupported, navigator: !!navigator.xr });

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Debug Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 text-white text-xs p-2 text-center">
        AR Supported: {arSupported ? 'Yes' : 'No'} | Camera:{' '}
        {cameraActive ? 'Active' : 'Inactive'} | Models: {placedModels.length}
      </div>
      {/* Camera Feed with 3D Overlay */}
      {cameraActive ? (
        <div className="w-full h-full relative">
          {/* Real Camera Feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
            webkit-playsinline="true"
            style={{
              transform: 'scaleX(-1)', // Mirror the camera for better UX
              objectFit: 'cover'
            }}
          />

          {/* Fallback if camera fails */}
          {!cameraStream && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Camera Loading...</p>
                <p className="text-sm opacity-75 mb-4">
                  3D models will appear here
                </p>

                {/* Mobile troubleshooting tips */}
                <div className="bg-white/20 rounded-lg p-3 max-w-xs">
                  <p className="text-xs font-medium mb-2">Mobile Tips:</p>
                  <ul className="text-xs space-y-1 text-left">
                    <li>• Allow camera permissions when prompted</li>
                    <li>• Tap the screen to activate camera</li>
                    <li>• Ensure you're using HTTPS</li>
                    <li>• Try refreshing the page</li>
                  </ul>

                  <Button
                    onClick={() => {
                      console.log('Retrying camera...');
                      startCamera();
                    }}
                    className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                    size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry Camera
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 3D Models Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <Canvas
              style={{ width: '100%', height: '100%' }}
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true
              }}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
              <ambientLight intensity={1.0} />
              <directionalLight position={[10, 10, 5]} intensity={2.0} />

              {/* Placed Models */}
              {placedModels.map(model => (
                <ARModel
                  key={model.id}
                  url={modelUrl}
                  position={model.position}
                />
              ))}
            </Canvas>
          </div>

          {/* Visual Feedback for Model Placement */}
          {placedModels.length > 0 && (
            <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              {placedModels.length} model{placedModels.length !== 1 ? 's' : ''}{' '}
              placed
            </div>
          )}

          {/* Camera Status Indicator */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {cameraStream ? (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Camera Active
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                Camera Loading...
              </span>
            )}
          </div>

          {/* AR Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border-2 border-white/50 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Placement Instructions */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <p className="text-sm font-medium text-white">
                Tap anywhere to place {siteName}
              </p>
            </motion.div>
          </div>
        </div>
      ) : (
        /* 3D Model Preview when camera is off */
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 5], fov: 75 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* 3D Model Preview */}
          <ARModel url={modelUrl} position={[0, 0, 0]} />

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            target={[0, 0, 0]}
          />
        </Canvas>
      )}

      {/* AR Experience Button - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={cameraActive ? stopCamera : startCamera}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg text-white font-medium px-6 py-3">
          {cameraActive ? (
            <>
              <X className="h-5 w-5" />
              Stop AR
            </>
          ) : (
            <>
              <Globe className="h-5 w-5" />
              Start AR Experience
            </>
          )}
        </Button>
      </div>

      {/* Fallback Button - Always Visible */}
      <div className="absolute bottom-20 left-4 z-50">
        <Button
          onClick={cameraActive ? stopCamera : startCamera}
          variant="secondary"
          className="gap-2 bg-white/90 text-black hover:bg-white shadow-lg">
          {cameraActive ? (
            <>
              <X className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Start
            </>
          )}
        </Button>
      </div>

      {/* Test Model Button */}
      <div className="absolute bottom-20 right-4 z-50">
        <Button
          onClick={() => {
            const testModel = {
              id: Date.now().toString(),
              position: [0, 0, -1] as [number, number, number],
              rotation: [0, 0, 0] as [number, number, number]
            };
            setPlacedModels(prev => [...prev, testModel]);
            console.log('Test model added at center');
          }}
          variant="outline"
          className="gap-2 bg-blue-500/90 text-white hover:bg-blue-600">
          <Target className="h-4 w-4" />
          Test Model
        </Button>
      </div>

      {/* Debug Video Ref Button */}
      <div className="absolute bottom-32 left-4 z-50">
        <Button
          onClick={() => {
            console.log('Video ref status:', {
              exists: !!videoRef.current,
              element: videoRef.current,
              tagName: videoRef.current?.tagName,
              readyState: videoRef.current?.readyState
            });
          }}
          variant="outline"
          size="sm"
          className="gap-2 bg-yellow-500/90 text-white hover:bg-yellow-600">
          <Info className="h-4 w-4" />
          Debug Video
        </Button>
      </div>

      {/* Control Buttons */}
      {cameraActive && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={resetModels}
            className="rounded-full bg-background/80 backdrop-blur-sm">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={() => setShowInfo(!showInfo)}
            className="rounded-full bg-background/80 backdrop-blur-sm">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass p-4 rounded-xl shadow-lg max-w-xs bg-background/90 backdrop-blur-sm">
            <h3 className="font-bold mb-2">{siteName}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tap anywhere on the screen to place the 3D model in your
              environment.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInfo(false)}>
                Got it
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Placed Models List */}
      {cameraActive && placedModels.length > 0 && (
        <div className="absolute top-20 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="text-sm font-medium mb-2">Placed Models</h4>
          <div className="space-y-2">
            {placedModels.map((model, index) => (
              <div key={model.id} className="flex items-center gap-2 text-xs">
                <span>Model {index + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeModel(model.id)}
                  className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click Handler for Model Placement */}
      {cameraActive && (
        <div
          className="absolute inset-0 z-10 cursor-crosshair"
          onClick={handleContainerClick}
          style={{ pointerEvents: 'auto' }}
        />
      )}
    </div>
  );
}
