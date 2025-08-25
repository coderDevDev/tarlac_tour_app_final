'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Html,
  useAnimations,
  OrbitControls,
  PerspectiveCamera,
  TransformControls
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
  RefreshCw,
  Move,
  RotateCw as RotateIcon,
  ZoomIn,
  Hand
} from 'lucide-react';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
}

function ARModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.5,
  isSelected = false,
  onSelect,
  onDeselect,
  onRefReady,
  onTransform
}: ModelProps & {
  onRefReady?: (ref: React.RefObject<THREE.Group>) => void;
  onTransform?: (updates: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
  }) => void;
}) {
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  {
    /* Touch gestures now handled by OrbitControls */
  }

  useEffect(() => {
    // Play the first animation if available
    if (animations.length > 0 && actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }

    // Pass ref back to parent when ready
    if (groupRef.current && onRefReady) {
      onRefReady(groupRef);
    }

    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, [actions, animations, mixer, onRefReady]);

  // Handle model selection
  const handleModelClick = (event: any) => {
    event.stopPropagation();
    if (isSelected) {
      onDeselect?.();
    } else {
      onSelect?.();
    }
  };

  {
    /* Touch gestures now handled by OrbitControls */
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        ref={meshRef}
        object={scene}
        onClick={handleModelClick}
        onPointerOver={(e: any) => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e: any) => {
          document.body.style.cursor = 'default';
        }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <Html center>
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            Selected
          </div>
        </Html>
      )}

      {/* Simple indicator that model is ready */}
      <Html position={[0, 1, 0]}>
        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
          Ready for interaction
        </div>
      </Html>
    </group>
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
      scale: number;
      ref?: React.RefObject<THREE.Group>;
    }>
  >([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [interactionMode, setInteractionMode] = useState<
    'place' | 'select' | 'transform'
  >('place');
  // Removed transformMode state since we're using touch gestures instead

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRefs = useRef<Map<string, React.RefObject<THREE.Group>>>(
    new Map()
  );

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
        rotation: [0, 0, 0] as [number, number, number],
        scale: 1.5
      };
      setPlacedModels(prev => [...prev, newModel]);
    },
    []
  );

  const removeModel = (id: string) => {
    setPlacedModels(prev => prev.filter(model => model.id !== model.id));
    if (selectedModelId === id) {
      setSelectedModelId(null);
    }
  };

  const resetModels = () => {
    setPlacedModels([]);
    setSelectedModelId(null);
  };

  const selectModel = (id: string) => {
    setSelectedModelId(id);
    setInteractionMode('select');
  };

  const deselectModel = () => {
    setSelectedModelId(null);
    setInteractionMode('place');
  };

  const updateModelTransform = (
    id: string,
    updates: Partial<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }>
  ) => {
    setPlacedModels(prev =>
      prev.map(model => (model.id === id ? { ...model, ...updates } : model))
    );
  };

  const handleModelRefReady = (
    id: string,
    ref: React.RefObject<THREE.Group>
  ) => {
    modelRefs.current.set(id, ref);
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

      // Check if we're on HTTPS (required for camera on mobile)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.error('Camera requires HTTPS on mobile devices');
        throw new Error(
          'Camera requires HTTPS on mobile devices. Please use HTTPS or localhost.'
        );
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Mobile-optimized camera settings with fallbacks
        const constraints = {
          video: {
            facingMode: { ideal: 'environment', fallback: 'user' },
            width: { ideal: 1280, max: 1920, min: 640 },
            height: { ideal: 720, max: 1080, min: 480 },
            aspectRatio: { ideal: 16 / 9, max: 2, min: 0.5 }
          },
          audio: false
        };

        console.log('Requesting camera with constraints:', constraints);

        // Try to get camera stream with fallback
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (constraintError) {
          console.log(
            'Primary constraints failed, trying fallback:',
            constraintError
          );
          // Fallback to basic constraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
          });
        }

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
          video.setAttribute('controls', 'false');

          // Set video properties
          video.playsInline = true;
          video.muted = true;
          video.autoplay = true;

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

          video.oncanplaythrough = () => {
            console.log('Video can play through');
            playVideo();
          };

          // Force play on user interaction (mobile requirement)
          const forcePlay = () => {
            console.log('User interaction detected, forcing video play');
            playVideo();
          };

          // Add multiple event listeners for mobile compatibility
          video.addEventListener('click', forcePlay);
          video.addEventListener('touchstart', forcePlay);
          video.addEventListener('touchend', forcePlay);
          video.addEventListener('mousedown', forcePlay);

          // Also add to container for better mobile support
          if (containerRef.current) {
            containerRef.current.addEventListener('touchstart', forcePlay);
            containerRef.current.addEventListener('click', forcePlay);
          }
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
    if (!cameraActive || !containerRef.current || interactionMode !== 'place')
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Place model at calculated position - make it more visible and centered
    const newModel = {
      id: Date.now().toString(),
      position: [x * 2, -y * 2, -2] as [number, number, number], // Further back but more spread out
      rotation: [0, 0, 0] as [number, number, number],
      scale: 1.5
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
      showInfo,
      selectedModelId,
      interactionMode
    });

    if (cameraActive) {
      console.log('Camera active, models count:', placedModels.length);
    }
  }, [
    arSupported,
    cameraActive,
    placedModels.length,
    showInfo,
    selectedModelId,
    interactionMode
  ]);

  // Removed page zoom prevention to allow model manipulation

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
        {cameraActive ? 'Active' : 'Inactive'} | Models: {placedModels.length} |
        Mode: {interactionMode}
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
              objectFit: 'cover',
              pointerEvents: 'none', // Prevent video from capturing touch events
              touchAction: 'none', // Prevent touch actions on video
              userSelect: 'none' // Prevent text selection
            }}
          />

          {/* Fallback if camera fails */}
          {!cameraStream && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-10">
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
                </div>
              </div>
            </div>
          )}

          {/* 3D Models Overlay - Always use OrbitControls for consistent touch handling */}
          <div className="absolute inset-0 z-80">
            <Canvas
              style={{
                width: '100%',
                height: '100%',
                touchAction: 'none',
                userSelect: 'none'
              }}
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true
              }}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2.5} />
              <pointLight position={[0, 5, 5]} intensity={1.0} />

              {/* Placed Models */}
              {placedModels.map(model => (
                <ARModel
                  key={model.id}
                  url={modelUrl}
                  position={model.position}
                  rotation={model.rotation}
                  scale={model.scale}
                  isSelected={selectedModelId === model.id}
                  onSelect={() => selectModel(model.id)}
                  onDeselect={deselectModel}
                  onRefReady={ref => handleModelRefReady(model.id, ref)}
                  onTransform={updates =>
                    updateModelTransform(model.id, updates)
                  }
                />
              ))}

              {/* Always use OrbitControls for consistent touch handling */}
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

              {/* Debug Grid to help visualize 3D space */}
              <gridHelper args={[10, 10, 0x444444, 0x888888]} />
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

          {/* Mobile Camera Info */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
            {location.protocol === 'https:' ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                HTTPS ✓
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                HTTP ✗ (Camera won't work)
              </span>
            )}
          </div>

          {/* Camera Error Status */}
          {!cameraStream && cameraActive && (
            <div className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Camera Error
              </span>
            </div>
          )}

          {/* AR Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 border-2 border-white/50 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Removed confusing green border indicator */}

          {/* Placement Instructions */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <p className="text-sm font-medium text-white">
                {interactionMode === 'place'
                  ? `Tap anywhere to place ${siteName}`
                  : 'Touch models directly to move, rotate, or scale'}
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

      {/* Main AR Experience Button - Bottom Center, Always Accessible */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
        <Button
          onClick={cameraActive ? stopCamera : startCamera}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-lg text-white font-medium px-6 py-3 min-w-[140px] text-sm sm:text-base">
          {cameraActive ? (
            <>
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
              Stop AR
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              Start AR Experience
            </>
          )}
        </Button>
      </div>

      {/* Touch Gesture Instructions - Always visible when models are placed */}
      {cameraActive && placedModels.length > 0 && (
        <div className="fixed top-4 right-4 z-[9998]">
          <div className="bg-background/95 backdrop-blur-md rounded-xl p-3 shadow-xl border-2 border-primary/20 max-w-[200px]">
            <div className="text-center text-sm font-medium text-primary mb-2">
              Touch Gestures
            </div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div>
                • <strong>One finger:</strong> Move model
              </div>
              <div>
                • <strong>Two fingers:</strong> Rotate model
              </div>
              <div>
                • <strong>Pinch:</strong> Scale model
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Removed transform mode instructions since gestures work directly on models */}

      {/* Control Buttons Row - Responsive and Always Accessible */}
      <div className="fixed bottom-12 left-2 right-2 sm:left-4 sm:right-4 z-[9998]">
        {/* Mobile: Stack buttons vertically for small screens */}
        <div className="block sm:hidden">
          <div className="flex flex-col gap-2 items-center">
            {/* Row 1: Camera Controls */}
            <div className="flex gap-2 justify-center">
              <Button
                onClick={cameraActive ? stopCamera : startCamera}
                variant="secondary"
                size="sm"
                className="gap-1 bg-white/90 text-black hover:bg-white shadow-lg min-w-[70px] text-xs">
                {cameraActive ? (
                  <>
                    <X className="h-3 w-3" />
                    Stop
                  </>
                ) : (
                  <>
                    <Camera className="h-3 w-3" />
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  console.log('Retrying camera...');
                  startCamera();
                }}
                variant="outline"
                size="sm"
                className="gap-1 bg-orange-500/90 text-white hover:bg-orange-600 min-w-[70px] text-xs">
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>

              <Button
                onClick={() => {
                  console.log('Requesting camera permission...');
                  navigator.mediaDevices
                    ?.getUserMedia({ video: true })
                    .then(stream => {
                      console.log('Permission granted, stopping test stream');
                      stream.getTracks().forEach(track => track.stop());
                      startCamera();
                    })
                    .catch(err => {
                      console.error('Permission request failed:', err);
                    });
                }}
                variant="outline"
                size="sm"
                className="gap-1 bg-green-500/90 text-white hover:bg-green-600 min-w-[70px] text-xs">
                <Camera className="h-3 w-3" />
                Permission
              </Button>
            </div>

            {/* Row 2: Model Controls */}
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  const testModel = {
                    id: Date.now().toString(),
                    position: [0, 0, -1] as [number, number, number],
                    rotation: [0, 0, 0] as [number, number, number],
                    scale: 1.5
                  };
                  setPlacedModels(prev => [...prev, testModel]);
                  console.log('Test model added at center');
                }}
                variant="outline"
                size="sm"
                className="gap-1 bg-blue-500/90 text-white hover:bg-blue-600 min-w-[70px] text-xs">
                <Target className="h-3 w-3" />
                Test
              </Button>

              <Button
                onClick={() => {
                  console.log('Video ref status:', {
                    exists: !!videoRef.current,
                    element: videoRef.current,
                    tagName: videoRef.current?.tagName,
                    readyState: videoRef.current?.readyState
                  });
                  console.log('3D Scene status:', {
                    placedModels: placedModels,
                    modelUrl: modelUrl,
                    cameraActive: cameraActive,
                    cameraStream: !!cameraStream
                  });
                  console.log('Touch system status:', {
                    selectedModelId,
                    interactionMode
                  });
                }}
                variant="outline"
                size="sm"
                className="gap-1 bg-yellow-500/90 text-white hover:bg-yellow-600 min-w-[70px] text-xs">
                <Info className="h-3 w-3" />
                Debug
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={resetModels}
                className="rounded-full bg-background/80 backdrop-blur-sm min-w-[40px] h-[40px] p-0">
                <RotateCcw className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => {
                  if (placedModels.length > 0) {
                    const firstModel = placedModels[0];
                    console.log(
                      'Testing touch system on model:',
                      firstModel.id
                    );
                    updateModelTransform(firstModel.id, {
                      position: [
                        firstModel.position[0] + 0.1,
                        firstModel.position[1],
                        firstModel.position[2]
                      ]
                    });
                  }
                }}
                variant="outline"
                size="sm"
                className="gap-1 bg-purple-500/90 text-white hover:bg-purple-600 min-w-[70px] text-xs">
                <Target className="h-3 w-3" />
                Test Touch
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal layout for larger screens */}
        <div className="hidden sm:flex justify-between items-center">
          {/* Left Side - Camera Controls */}
          <div className="flex gap-2">
            <Button
              onClick={cameraActive ? stopCamera : startCamera}
              variant="secondary"
              className="gap-2 bg-white/90 text-black hover:bg-white shadow-lg min-w-[80px]">
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

            <Button
              onClick={() => {
                console.log('Retrying camera...');
                startCamera();
              }}
              variant="outline"
              size="sm"
              className="gap-2 bg-orange-500/90 text-white hover:bg-orange-600 min-w-[80px]">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>

            <Button
              onClick={() => {
                console.log('Requesting camera permission...');
                navigator.mediaDevices
                  ?.getUserMedia({ video: true })
                  .then(stream => {
                    console.log('Permission granted, stopping test stream');
                    stream.getTracks().forEach(track => track.stop());
                    startCamera();
                  })
                  .catch(err => {
                    console.error('Permission request failed:', err);
                  });
              }}
              variant="outline"
              size="sm"
              className="gap-2 bg-green-500/90 text-white hover:bg-green-600 min-w-[80px]">
              <Camera className="h-4 w-4" />
              Permission
            </Button>

            <Button
              onClick={() => {
                console.log('Video ref status:', {
                  exists: !!videoRef.current,
                  element: videoRef.current,
                  tagName: videoRef.current?.tagName,
                  readyState: videoRef.current?.readyState
                });
                console.log('3D Scene status:', {
                  placedModels: placedModels,
                  modelUrl: modelUrl,
                  cameraActive: cameraActive,
                  cameraStream: !!cameraStream
                });
              }}
              variant="outline"
              size="sm"
              className="gap-2 bg-yellow-500/90 text-white hover:bg-yellow-600 min-w-[80px]">
              <Info className="h-4 w-4" />
              Debug
            </Button>
          </div>

          {/* Right Side - Model Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const testModel = {
                  id: Date.now().toString(),
                  position: [0, 0, -1] as [number, number, number],
                  rotation: [0, 0, 0] as [number, number, number],
                  scale: 1.5
                };
                setPlacedModels(prev => [...prev, testModel]);
                console.log('Test model added at center');
              }}
              variant="outline"
              className="gap-2 bg-blue-500/90 text-white hover:bg-blue-600 min-w-[80px]">
              <Target className="h-4 w-4" />
              Test
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={resetModels}
              className="rounded-full bg-background/80 backdrop-blur-sm min-w-[40px] h-[40px] p-0">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Button - Always Accessible */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[9997]">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setShowInfo(!showInfo)}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg w-8 h-8 sm:w-10 sm:h-10">
          <Info className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-[9996]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass p-3 sm:p-4 rounded-xl shadow-lg max-w-xs mx-auto bg-background/90 backdrop-blur-sm border">
            <h3 className="font-bold mb-2 text-sm sm:text-base">{siteName}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Tap anywhere on the screen to place the 3D model in your
              environment. Once placed, touch the model directly to move,
              rotate, or scale it.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInfo(false)}
                className="text-xs sm:text-sm">
                Got it
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Placed Models List - Always Accessible */}
      {placedModels.length > 0 && (
        <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-[9995] bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border max-w-[180px] sm:max-w-[200px]">
          <h4 className="text-xs sm:text-sm font-medium mb-2">
            Placed Models ({placedModels.length})
          </h4>
          <div className="space-y-1 sm:space-y-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto">
            {placedModels.map((model, index) => (
              <div key={model.id} className="flex items-center gap-2 text-xs">
                <span
                  className={`flex-1 ${
                    selectedModelId === model.id
                      ? 'font-bold text-blue-600'
                      : ''
                  }`}>
                  Model {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeModel(model.id)}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-red-100">
                  <X className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed touch isolation layer that was blocking model touches */}

      {/* Removed smart touch handler - video element now has pointer-events: none */}

      {/* Touch Debug Overlay - Shows where touches are being captured */}
      {cameraActive && (
        <div className="fixed top-4 left-4 z-[9999] bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
          <div className="mb-2 font-bold">Touch Debug</div>
          <div>Camera Active: {cameraActive ? 'Yes' : 'No'}</div>
          <div>Models Placed: {placedModels.length}</div>
          <div>Selected Model: {selectedModelId || 'None'}</div>
          <div>Interaction Mode: {interactionMode}</div>
          <div className="mt-2 text-yellow-400">
            Touch a model to see console logs
          </div>
          <button
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
            onClick={() => {
              console.log('=== TOUCH SYSTEM TEST ===');
              console.log('Camera Active:', cameraActive);
              console.log('Models Placed:', placedModels.length);
              console.log('Model Refs:', modelRefs.current);
              console.log('Canvas Element:', document.querySelector('canvas'));
              console.log('Touch Event Support:', 'ontouchstart' in window);
              console.log('Video Element:', videoRef.current);
              console.log(
                'Video pointer-events:',
                videoRef.current?.style.pointerEvents
              );
            }}>
            Test Touch System
          </button>
          <div className="mt-2 text-xs">
            <div>Video pointer-events: none</div>
            <div>Canvas z-index: 80</div>
            <div>Using OrbitControls for touch</div>
            <div>Touch gestures should work now!</div>
          </div>
        </div>
      )}

      {/* Click Handler for Model Placement */}
      {cameraActive && interactionMode === 'place' && (
        <div
          className="absolute inset-0 z-10 cursor-crosshair"
          onClick={handleContainerClick}
          style={{ pointerEvents: 'auto' }}
        />
      )}
    </div>
  );
}
