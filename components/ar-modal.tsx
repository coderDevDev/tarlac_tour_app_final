'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Camera, Globe, Target, Move3D, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Html,
  useAnimations,
  OrbitControls,
  PerspectiveCamera,
  Grid
} from '@react-three/drei';
import * as THREE from 'three';

// AR Camera Component that responds to device sensors
function ARCamera({
  deviceOrientation,
  deviceMotion,
  surfacePosition
}: {
  deviceOrientation: { alpha: number; beta: number; gamma: number };
  deviceMotion: { x: number; y: number; z: number };
  surfacePosition: [number, number, number];
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (cameraRef.current) {
      // Convert device orientation to camera rotation
      const alpha = (deviceOrientation.alpha * Math.PI) / 180; // Z axis rotation
      const beta = (deviceOrientation.beta * Math.PI) / 180; // X axis rotation
      const gamma = (deviceOrientation.gamma * Math.PI) / 180; // Y axis rotation

      // Apply device motion to camera position
      const motionX = deviceMotion.x * 0.1; // Scale down motion
      const motionY = deviceMotion.y * 0.1;
      const motionZ = deviceMotion.z * 0.1;

      // Update camera position based on device motion
      cameraRef.current.position.x = motionX;
      cameraRef.current.position.y = motionY + 2; // Keep camera above ground
      cameraRef.current.position.z = motionZ + 8;

      // Update camera rotation based on device orientation
      cameraRef.current.rotation.x = beta;
      cameraRef.current.rotation.y = alpha;
      cameraRef.current.rotation.z = gamma;

      // Look at the surface position
      cameraRef.current.lookAt(
        surfacePosition[0],
        surfacePosition[1],
        surfacePosition[2]
      );
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, 8]}
      fov={60}
    />
  );
}

// AR Surface Detection Component
function ARSurfaceDetection({
  onSurfaceDetected
}: {
  onSurfaceDetected?: (position: [number, number, number]) => void;
}) {
  const [surfacePosition, setSurfacePosition] = useState<
    [number, number, number]
  >([0, -2, 0]);
  const [isDetecting, setIsDetecting] = useState(true);
  const detectionRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (detectionRef.current && isDetecting) {
      // Simulate surface detection with camera movement
      const time = state.clock.getElapsedTime();
      const newY = -2 + Math.sin(time * 0.5) * 0.5;
      const newPosition: [number, number, number] = [0, newY, 0];
      setSurfacePosition(newPosition);
      onSurfaceDetected?.(newPosition);
    }
  });

  return (
    <group ref={detectionRef}>
      {/* Surface detection grid */}
      <Grid
        position={surfacePosition}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#9d4edd"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Surface indicator */}
      <Html position={[0, surfacePosition[1] + 0.1, 0]} center>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-400 rounded-full animate-pulse bg-green-400/20"></div>
          <div className="text-xs text-green-400 mt-1 font-medium">
            Surface Detected
          </div>
        </div>
      </Html>
    </group>
  );
}

// AR Model Component for modal
function ARModelOverlay({
  url,
  position = [0, 0, 0],
  scale = 1.5,
  onModelReady,
  onModelLoading,
  surfacePosition = [0, 0, 0]
}: {
  url: string;
  position?: [number, number, number];
  scale?: number;
  onModelReady?: () => void;
  onModelLoading?: () => void;
  surfacePosition?: [number, number, number];
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
    if (scene) {
      console.log('AR Modal: Scene loaded, checking children...');
      console.log('Scene children count:', scene.children.length);

      // Check if scene has content or if it's a valid scene
      if (scene.children && scene.children.length > 0) {
        console.log('AR Modal: Model scene loaded with children');
      } else {
        console.log(
          'AR Modal: Scene loaded but no children - might be placeholder'
        );
      }

      // Mark as loaded regardless of children count (for placeholder models)
      const timer = setTimeout(() => {
        setModelLoaded(true);
        onModelReady?.();
        console.log('AR Modal: Model ready callback triggered');
      }, 200); // Even faster response

      return () => clearTimeout(timer);
    }
  }, [scene, onModelReady]);

  // Fallback: If model doesn't load within 5 seconds, mark as ready
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!modelLoaded) {
        console.log('AR Modal: Model loading timeout - marking as ready');
        setModelLoaded(true);
        onModelReady?.();
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(fallbackTimer);
  }, [modelLoaded, onModelReady]);

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
    <group
      ref={groupRef}
      position={[
        surfacePosition[0],
        surfacePosition[1] + 0.5,
        surfacePosition[2]
      ]}
      scale={scale}>
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

      {/* AR Model Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* AR Model Info */}
      <Html position={[0, 2, 0]} center>
        <div className="text-center bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
          <div className="text-white text-sm font-medium">3D Model</div>
          <div className="text-green-400 text-xs">Touch to interact</div>
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
  const [isInitializing, setIsInitializing] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [surfacePosition, setSurfacePosition] = useState<
    [number, number, number]
  >([0, -2, 0]);
  const [arInteractionMode, setArInteractionMode] = useState<
    'move' | 'rotate' | 'scale'
  >('move');
  const [deviceOrientation, setDeviceOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0
  });
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0, z: 0 });
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const orientationRef = useRef<{ alpha: number; beta: number; gamma: number }>(
    { alpha: 0, beta: 0, gamma: 0 }
  );
  const motionRef = useRef<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0
  });

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset all states when modal opens
      setIsInitializing(true);
      setArMode(false);
      setModelLoading(false);
      setModelReady(false);
      setError(null);

      // Prevent page zoom and scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Start camera after a small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        startCamera();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // Clean up when modal closes
      stopCamera();
      setIsInitializing(false);
      setArMode(false);
      setModelLoading(false);
      setModelReady(false);
      setError(null);

      // Restore page scrolling and zoom
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    }
  }, [isOpen]);

  // Auto-enable AR mode after camera starts
  useEffect(() => {
    if (cameraActive && !arMode) {
      const timer = setTimeout(() => {
        console.log('Auto-enabling AR mode in modal');
        setIsInitializing(false);
        setArMode(true);
        setModelLoading(true);
        setModelReady(false);

        // Immediate fallback: Force model ready after 1 second
        setTimeout(() => {
          console.log('Modal: Immediate fallback - marking model as ready');
          setModelLoading(false);
          setModelReady(true);
        }, 1000);

        // Additional fallback: If model doesn't load within 3 seconds, mark as ready
        setTimeout(() => {
          if (!modelReady) {
            console.log('Modal: Model loading timeout - marking as ready');
            setModelLoading(false);
            setModelReady(true);
          }
        }, 3000);
      }, 1000); // Reduced delay for faster response

      return () => clearTimeout(timer);
    }
  }, [cameraActive, arMode]);

  // Additional fallback: Force model ready after 5 seconds if still loading
  useEffect(() => {
    if (arMode && modelLoading && !modelReady) {
      const forceReadyTimer = setTimeout(() => {
        console.log(
          'Force ready: Model has been loading too long, forcing ready state'
        );
        setModelLoading(false);
        setModelReady(true);
      }, 5000);

      return () => clearTimeout(forceReadyTimer);
    }
  }, [arMode, modelLoading, modelReady]);

  // Enable sensors when AR mode starts
  useEffect(() => {
    if (arMode && surfaceDetected) {
      enableSensors();
    } else {
      disableSensors();
    }

    return () => {
      disableSensors();
    };
  }, [arMode, surfaceDetected]);

  // Clean up sensors when modal closes
  useEffect(() => {
    if (!isOpen) {
      disableSensors();
    }
  }, [isOpen]);

  // Debug state changes
  useEffect(() => {
    console.log('AR Modal State Change:', {
      isInitializing,
      cameraActive,
      arMode,
      modelLoading,
      modelReady,
      error
    });
  }, [isInitializing, cameraActive, arMode, modelLoading, modelReady, error]);

  // Stable callbacks to prevent re-renders
  const handleModelLoading = useCallback(() => {
    console.log('AR Modal: Model loading started');
    setModelLoading(true);
    setModelReady(false);
  }, []);

  const handleModelReady = useCallback(() => {
    console.log('AR Modal: Model ready callback received');
    setModelLoading(false);
    setModelReady(true);
    console.log('States updated: modelLoading=false, modelReady=true');
  }, []);

  const handleSurfaceDetected = useCallback(
    (position: [number, number, number]) => {
      console.log('AR Modal: Surface detected at:', position);
      setSurfacePosition(position);
      setSurfaceDetected(true);
    },
    []
  );

  // Device orientation handler
  const handleOrientationChange = useCallback(
    (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      orientationRef.current = {
        alpha: alpha || 0,
        beta: beta || 0,
        gamma: gamma || 0
      };
      setDeviceOrientation({
        alpha: alpha || 0,
        beta: beta || 0,
        gamma: gamma || 0
      });
    },
    []
  );

  // Device motion handler
  const handleMotionChange = useCallback((event: DeviceMotionEvent) => {
    const { acceleration } = event;
    if (acceleration) {
      const { x, y, z } = acceleration;
      motionRef.current = { x: x || 0, y: y || 0, z: z || 0 };
      setDeviceMotion({ x: x || 0, y: y || 0, z: z || 0 });
    }
  }, []);

  // Enable device sensors
  const enableSensors = useCallback(async () => {
    try {
      // Request permission for device orientation
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (permission !== 'granted') {
          console.log('Device orientation permission denied');
          return;
        }
      }

      // Add event listeners
      window.addEventListener(
        'deviceorientation',
        handleOrientationChange,
        true
      );
      window.addEventListener('devicemotion', handleMotionChange, true);

      setSensorEnabled(true);
      console.log('Device sensors enabled');
    } catch (error) {
      console.error('Error enabling sensors:', error);
    }
  }, [handleOrientationChange, handleMotionChange]);

  // Disable device sensors
  const disableSensors = useCallback(() => {
    window.removeEventListener(
      'deviceorientation',
      handleOrientationChange,
      true
    );
    window.removeEventListener('devicemotion', handleMotionChange, true);
    setSensorEnabled(false);
    console.log('Device sensors disabled');
  }, [handleOrientationChange, handleMotionChange]);

  const startCamera = async () => {
    try {
      console.log('Starting camera for AR modal...');
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Clean up existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
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
        // Clear previous source
        videoRef.current.srcObject = null;

        // Set new source
        videoRef.current.srcObject = stream;

        // Wait for metadata to load
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
      } else {
        console.error('Video element not found');
        setError('Video element not available');
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
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}>
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}>
          {/* Close Button */}
          <Button
            size="icon"
            variant="secondary"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-red-500/80 hover:bg-red-600/90 text-white border-red-400/50 rounded-full shadow-lg">
            <X className="h-5 w-5" />
          </Button>

          {/* AR Interaction Controls */}
          {arMode && surfaceDetected && (
            <div className="absolute top-4 left-4 z-30 flex gap-2">
              <Button
                size="sm"
                variant={arInteractionMode === 'move' ? 'default' : 'secondary'}
                onClick={() => setArInteractionMode('move')}
                className="bg-blue-500/80 hover:bg-blue-600/90 text-white border-blue-400/50 rounded-lg shadow-lg">
                <Move3D className="h-4 w-4 mr-1" />
                Move
              </Button>
              <Button
                size="sm"
                variant={
                  arInteractionMode === 'rotate' ? 'default' : 'secondary'
                }
                onClick={() => setArInteractionMode('rotate')}
                className="bg-purple-500/80 hover:bg-purple-600/90 text-white border-purple-400/50 rounded-lg shadow-lg">
                <RotateCcw className="h-4 w-4 mr-1" />
                Rotate
              </Button>
              <Button
                size="sm"
                variant={
                  arInteractionMode === 'scale' ? 'default' : 'secondary'
                }
                onClick={() => setArInteractionMode('scale')}
                className="bg-green-500/80 hover:bg-green-600/90 text-white border-green-400/50 rounded-lg shadow-lg">
                <Target className="h-4 w-4 mr-1" />
                Scale
              </Button>
            </div>
          )}

          {/* Sensor Control Button */}
          {arMode && surfaceDetected && (
            <Button
              size="sm"
              variant={sensorEnabled ? 'default' : 'secondary'}
              onClick={sensorEnabled ? disableSensors : enableSensors}
              className="absolute top-16 left-4 z-30 bg-purple-500/80 hover:bg-purple-600/90 text-white border-purple-400/50 rounded-lg shadow-lg">
              {sensorEnabled ? 'Disable Sensors' : 'Enable Sensors'}
            </Button>
          )}

          {/* Debug Button - Force Model Ready */}
          {arMode && modelLoading && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                console.log('Manual force ready clicked');
                setModelLoading(false);
                setModelReady(true);
              }}
              className="absolute top-28 left-4 z-30 bg-blue-500/80 hover:bg-blue-600/90 text-white border-blue-400/50 rounded-lg shadow-lg">
              Force Ready
            </Button>
          )}

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

          {/* Initialization Overlay */}
          {(isInitializing || !cameraActive) && (
            <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">
                  {isInitializing ? 'Initializing AR...' : 'Starting Camera...'}
                </h3>
                <p className="text-sm text-gray-300">
                  {isInitializing
                    ? 'Setting up AR experience...'
                    : 'Please allow camera access for AR experience'}
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
                  userSelect: 'none',
                  position: 'relative',
                  zIndex: 1
                }}
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{
                  alpha: true,
                  antialias: true,
                  preserveDrawingBuffer: true
                }}
                onPointerMissed={() => {
                  // Prevent page zoom when clicking on canvas
                  document.body.style.overflow = 'hidden';
                }}>
                {/* AR Camera with device sensor integration */}
                <ARCamera
                  deviceOrientation={deviceOrientation}
                  deviceMotion={deviceMotion}
                  surfacePosition={surfacePosition}
                />

                {/* AR Environment Setup - Removed HDR loading to prevent errors */}

                {/* AR-Optimized Lighting Setup */}
                <ambientLight intensity={0.6} />
                <directionalLight
                  position={[5, 10, 5]}
                  intensity={1.2}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                  shadow-camera-far={50}
                  shadow-camera-left={-10}
                  shadow-camera-right={10}
                  shadow-camera-top={10}
                  shadow-camera-bottom={-10}
                />
                <pointLight position={[0, 5, 5]} intensity={0.6} />
                <pointLight
                  position={[-5, 3, 2]}
                  intensity={0.4}
                  color="#ffaa00"
                />
                <hemisphereLight args={[0xffffff, 0x444444, 0.8]} />

                {/* AR Surface Detection */}
                <ARSurfaceDetection onSurfaceDetected={handleSurfaceDetected} />

                {/* 3D Model Overlay - Only show when surface is detected */}
                {surfaceDetected && (
                  <ARModelOverlay
                    url={site.modelUrl || '/models/placeholder.glb'}
                    scale={1.5}
                    surfacePosition={surfacePosition}
                    onModelLoading={handleModelLoading}
                    onModelReady={handleModelReady}
                  />
                )}

                {/* Enhanced OrbitControls for AR interaction */}
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  minDistance={2}
                  maxDistance={15}
                  target={surfacePosition}
                  enableDamping={true}
                  dampingFactor={0.05}
                  maxPolarAngle={Math.PI / 1.8}
                  minPolarAngle={Math.PI / 6}
                  touches={{
                    ONE: 1, // One finger for rotation
                    TWO: 2 // Two fingers for zoom and pan
                  }}
                />

                {/* AR Crosshair with surface detection feedback */}
                <Html center>
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 border-2 rounded-full relative pointer-events-none transition-all duration-300 ${
                        surfaceDetected
                          ? 'border-green-400 shadow-green-400/50'
                          : 'border-white/30'
                      }`}>
                      <div
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                          surfaceDetected ? 'bg-green-400' : 'bg-white/50'
                        }`}></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full"></div>
                    </div>
                    <div
                      className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                        surfaceDetected ? 'text-green-400' : 'text-white/70'
                      }`}>
                      {surfaceDetected
                        ? 'Surface Ready'
                        : 'Detecting Surface...'}
                    </div>
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
              className="absolute bottom-4 left-4 right-4 z-30 bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full border ${
                      surfaceDetected && modelReady
                        ? 'bg-green-500/20 border-green-400/30'
                        : 'bg-blue-500/20 border-blue-400/30'
                    }`}>
                    {surfaceDetected && modelReady ? (
                      <Globe className="h-5 w-5 text-green-400" />
                    ) : (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">
                      {site.name} - AR Experience
                    </h3>
                    <p className="text-xs text-gray-300">
                      {surfaceDetected && modelReady
                        ? `AR Active - ${arInteractionMode} mode - Touch to interact`
                        : surfaceDetected
                        ? 'Surface detected - Loading 3D model...'
                        : 'Detecting surface...'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {surfaceDetected ? '✓ Surface' : '⏳ Surface'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {modelReady ? '✓ Model' : '⏳ Model'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {sensorEnabled ? '✓ Sensors' : '⏳ Sensors'}
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
