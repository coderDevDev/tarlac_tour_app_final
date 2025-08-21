'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Html,
  useAnimations,
  ARButton,
  Interactive,
  useHitTest,
  useXR
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Info, RotateCcw, X } from 'lucide-react';

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
  const [arSession, setArSession] = useState<XRSession | null>(null);
  const [placedModels, setPlacedModels] = useState<
    Array<{
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
    }>
  >([]);

  // Check AR support
  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then(supported => {
        setArSupported(supported);
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

  if (!arSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="mb-4 p-4 bg-yellow-100 rounded-full">
          <Info className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">AR Not Supported</h3>
        <p className="text-muted-foreground mb-4">
          Your device doesn't support AR features. Try using a modern smartphone
          with AR capabilities.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ARButton
        sessionInit={{
          requiredFeatures: ['hit-test', 'dom-overlay'],
          domOverlay: { root: document.body }
        }}
        onUnsupported={() => {
          setArSupported(false);
        }}
        onSessionStart={session => {
          setArSession(session);
        }}
        onSessionEnd={() => {
          setArSession(null);
        }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        Start AR Experience
      </ARButton>

      {arSession && (
        <Canvas
          style={{ width: '100%', height: '100%' }}
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0, 0, 0], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* AR Hit Testing */}
          <ARHitTest onHit={handlePlaceModel} />

          {/* Placed Models */}
          {placedModels.map(model => (
            <ARModel key={model.id} url={modelUrl} position={model.position} />
          ))}

          {/* AR Session Info */}
          {showInfo && (
            <Html position={[0, 0, -1]} center>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass p-4 rounded-xl shadow-lg max-w-xs bg-background/90 backdrop-blur-sm">
                <h3 className="font-bold mb-2">{siteName}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Point your camera at a flat surface and tap to place the 3D
                  model.
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
            </Html>
          )}
        </Canvas>
      )}

      {/* Control Buttons */}
      {arSession && (
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

      {/* Model Placement Instructions */}
      {arSession && placedModels.length === 0 && (
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
      {arSession && placedModels.length > 0 && (
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

// AR Hit Testing Component
function ARHitTest({
  onHit
}: {
  onHit: (hit: THREE.Vector3, normal: THREE.Vector3) => void;
}) {
  const { camera } = useThree();
  const hitTest = useHitTest((hit, matrix) => {
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(matrix);
    const normal = new THREE.Vector3(0, 1, 0);
    onHit(position, normal);
  });

  return null;
}
