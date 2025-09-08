'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// AR Model Component for modal
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
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    onModelLoading?.();
    setModelLoaded(false);
    console.log('AR Modal: Starting to load model:', url);
  }, [url, onModelLoading]);

  useEffect(() => {
    if (scene && scene.children && scene.children.length > 0) {
      console.log(
        'AR Modal: Model scene loaded, children count:',
        scene.children.length
      );

      const timer = setTimeout(() => {
        setModelLoaded(true);
        onModelReady?.();
        console.log('AR Modal: Model ready callback triggered');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [scene, onModelReady]);

  useEffect(() => {
    if (animations.length > 0 && actions && modelLoaded) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
        console.log('AR Modal: Animation started');
      }
    }
  }, [actions, animations, modelLoaded]);

  useEffect(() => {
    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, [mixer]);

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

      {/* Model status indicator */}
      <Html position={[0, 1, 0]}>
        <div
          className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${
            modelLoaded
              ? 'bg-green-500/80 text-white'
              : 'bg-blue-500/80 text-white'
          }`}>
          {modelLoaded ? '✓ Model Ready' : '⏳ Loading...'}
        </div>
      </Html>
    </group>
  );
}

interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: {
    id: string;
    name: string;
    modelUrl?: string;
  };
}

export default function ARModal({ isOpen, onClose, site }: ARModalProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setArMode(false);
      setModelLoading(false);
      setModelReady(false);
    }
  }, [isOpen]);

  // Auto-enable AR mode after camera starts
  useEffect(() => {
    if (cameraActive && !arMode) {
      const timer = setTimeout(() => {
        console.log('Auto-enabling AR mode in modal');
        setArMode(true);
        setModelLoading(true);
        setModelReady(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [cameraActive, arMode]);

  const startCamera = async () => {
    try {
      console.log('Starting camera for AR modal...');
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log('Camera started successfully in modal');
                setCameraActive(true);
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError(`Error displaying camera feed: ${err.message}`);
              });
          }
        };
      }
    } catch (err: any) {
      console.error('Error starting camera:', err);
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        setError(
          'Camera permission denied. Please allow camera access and try again.'
        );
      } else {
        setError(`Error accessing camera: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl overflow-hidden">
          {/* Close Button */}
          <Button
            size="icon"
            variant="secondary"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white border-white/30 rounded-full">
            <X className="h-4 w-4" />
          </Button>

          {/* Camera Feed */}
          <video
            ref={videoRef}
            className={`${
              cameraActive
                ? 'absolute inset-0 w-full h-full object-cover z-10'
                : 'hidden'
            }`}
            playsInline
            muted
            autoPlay
            style={{
              objectFit: 'cover',
              pointerEvents: 'none',
              touchAction: 'none',
              userSelect: 'none'
            }}
          />

          {/* Camera Not Active Overlay */}
          {!cameraActive && (
            <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Camera className="h-16 w-16 mx-auto mb-4 text-white/70" />
                <h3 className="text-lg font-semibold mb-2">
                  Starting Camera...
                </h3>
                <p className="text-sm text-gray-300">
                  Please allow camera access for AR experience
                </p>
              </div>
            </div>
          )}

          {/* AR Overlay - 3D Models over Camera */}
          {arMode && cameraActive && (
            <div className="absolute inset-0 z-20">
              {/* Model Loading Overlay */}
              {modelLoading && !modelReady && (
                <div className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">
                      Loading 3D Model
                    </h3>
                    <p className="text-sm text-gray-300 max-w-xs">
                      Preparing {site.name} for AR experience...
                    </p>
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
                  url={site.modelUrl || '/models/placeholder.glb'}
                  position={[0, 0, 0]}
                  scale={1.5}
                  onModelLoading={() => {
                    console.log('AR Modal: Model loading started');
                    setModelLoading(true);
                    setModelReady(false);
                  }}
                  onModelReady={() => {
                    console.log('AR Modal: Model ready callback received');
                    setModelLoading(false);
                    setModelReady(true);
                  }}
                />

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

                {/* AR Crosshair */}
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
          {arMode && (
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
                      {site.name}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {modelReady
                        ? 'AR Mode Active - Touch to interact with 3D model'
                        : 'Loading 3D model...'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <div className="absolute top-20 left-4 right-4 z-30">
              <div className="bg-red-500/90 text-white px-4 py-3 rounded-lg text-center">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
