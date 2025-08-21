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
import { Info, RotateCcw, X, Camera, Globe, Target } from 'lucide-react';
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

  // Check AR support
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
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        setCameraStream(stream);
        setCameraActive(true);

        // Set up video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        return stream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
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
      position: [x * 1.5, -y * 1.5, -2] as [number, number, number], // Closer and more visible
      rotation: [0, 0, 0] as [number, number, number]
    };

    console.log('Placing model at:', newModel.position, 'from click at:', {
      x: event.clientX,
      y: event.clientY
    });
    setPlacedModels(prev => [...prev, newModel]);
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
        AR Supported: {arSupported ? 'Yes' : 'No'} | Camera: {cameraActive ? 'Active' : 'Inactive'} | Models: {placedModels.length}
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
          />

          {/* 3D Models Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <Canvas
              style={{ width: '100%', height: '100%' }}
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{ alpha: true, antialias: true }}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />

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
