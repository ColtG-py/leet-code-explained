"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useSceneObjectRegistry } from "./SceneObjectRegistry"
import type { Group } from "three"

interface OrbitConfig {
  radius: number
  speed: number
  tilt?: number
  axis?: "x" | "y" | "z"
  phase?: number
}

interface AutoRotateConfig {
  axis?: "x" | "y" | "z"
  speed?: number
}

interface ModelProps {
  src: string
  id?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
  interactive?: boolean
  orbit?: OrbitConfig
  autoRotate?: AutoRotateConfig
  children?: ReactNode
}

export default function Model({
  src,
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  castShadow = false,
  receiveShadow = false,
  interactive = false,
  orbit,
  autoRotate,
  children,
}: ModelProps) {
  const { scene } = useGLTF(src)
  const groupRef = useRef<Group>(null)
  const registry = useSceneObjectRegistry()

  useEffect(() => {
    if (id && groupRef.current) {
      registry.register(id, groupRef.current)
      return () => registry.unregister(id)
    }
  }, [id, registry])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Auto rotation on local axis
    if (autoRotate) {
      const axis = autoRotate.axis ?? "y"
      const speed = autoRotate.speed ?? 0.3
      groupRef.current.rotation[axis] += delta * speed
    }

    // Orbital motion
    if (orbit) {
      const elapsed = performance.now() / 1000
      const phase = ((orbit.phase ?? 0) * Math.PI) / 180
      const angle = elapsed * orbit.speed + phase
      const tiltRad = ((orbit.tilt ?? 0) * Math.PI) / 180

      groupRef.current.position.x = Math.cos(angle) * orbit.radius
      groupRef.current.position.z = Math.sin(angle) * orbit.radius
      groupRef.current.position.y = Math.sin(angle) * Math.sin(tiltRad) * orbit.radius
    }
  })

  const scaleArray: [number, number, number] = Array.isArray(scale) ? scale : [scale, scale, scale]

  return (
    <group
      ref={groupRef}
      position={orbit ? undefined : position}
      rotation={rotation}
      scale={scaleArray}
    >
      <primitive
        object={scene.clone()}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        raycast={interactive ? undefined : () => null}
      />
      {children}
    </group>
  )
}
