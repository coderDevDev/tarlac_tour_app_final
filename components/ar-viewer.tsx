"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Html, PerspectiveCamera, useAnimations } from "@react-three/drei"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Info, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

interface ModelProps {
  url: string
}

function Model({ url }: ModelProps) {
  const { scene, animations } = useGLTF(url)
  const { actions, mixer } = useAnimations(animations, scene)

  useEffect(() => {
    // Play the first animation if available
    if (animations.length > 0 && actions) {
      const firstAction = Object.values(actions)[0]
      if (firstAction) {
        firstAction.play()
      }
    }

    return () => {
      if (mixer) {
        // Clean up animations
        mixer.stopAllAction()
      }
    }
  }, [actions, animations, mixer])

  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
}

interface ARViewerProps {
  modelUrl: string
  siteName: string
}

export default function ARViewer({ modelUrl, siteName }: ARViewerProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5])
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef(null)

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Canvas camera={{ position: cameraPosition, fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center justify-center text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <p className="font-medium">Loading 3D model...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
              </div>
            </Html>
          }
        >
          <Model url={modelUrl} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          target={[0, 0, 0]}
        />

        {showInfo && (
          <Html position={[2, 2, 0]} center>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass p-4 rounded-xl shadow-lg max-w-xs"
            >
              <h3 className="font-bold mb-2">{siteName}</h3>
              <p className="text-sm">
                This is a 3D representation of {siteName}. Explore the model by dragging to rotate and pinching to zoom.
              </p>
              <Button size="sm" variant="outline" className="mt-3 rounded-full" onClick={() => setShowInfo(false)}>
                Close
              </Button>
            </motion.div>
          </Html>
        )}
      </Canvas>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={resetCamera}
          className="rounded-full bg-background/80 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={() => setShowInfo(!showInfo)}
          className="rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
