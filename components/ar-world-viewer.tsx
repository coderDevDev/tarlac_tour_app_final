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
import { Info, RotateCcw, X, Camera, Globe } from 'lucide-react';
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
  const [placedModels, setPlacedModels] = useState<
    Array<{
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
    }>
  >([]);

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
          video: { facingMode: 'environment' }
        });
        setCameraActive(true);
        // Store stream for cleanup
        return stream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
    }
  };

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

  return (
    <div className="relative w-full h-full">
      {/* AR Experience Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={startCamera}
          className="gap-2 bg-primary hover:bg-primary/90">
          <Globe className="h-4 w-4" />
          Start AR Experience
        </Button>
      </div>

      {/* Camera Feed or 3D Scene */}
      {cameraActive ? (
        <div className="w-full h-full bg-black">
          {/* Camera feed would go here in a real AR implementation */}
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <Camera className="h-16 w-16 mx-auto mb-4 text-white/50" />
              <p className="text-lg font-medium mb-2">Camera Active</p>
              <p className="text-sm text-white/70">
                Point camera at flat surfaces to place {siteName}
              </p>
            </div>
          </div>
        </div>
      ) : (
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
              Point your camera at a flat surface and tap to place the 3D model.
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

      {/* Model Placement Instructions */}
      {cameraActive && placedModels.length === 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm font-medium">
              Point camera at a flat surface and tap to place {siteName}
            </p>
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
    </div>
  );
}
