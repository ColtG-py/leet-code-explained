"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { useFrame } from "@react-three/fiber"
import { useSceneObjectRegistry } from "./SceneObjectRegistry"
import type { Group as ThreeGroup } from "three"

interface AutoRotateConfig {
  axis?: "x" | "y" | "z"
  speed?: number
}

interface GroupProps {
  id?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  autoRotate?: AutoRotateConfig
  children?: ReactNode
}

export default function Group({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate,
  children,
}: GroupProps) {
  const groupRef = useRef<ThreeGroup>(null)
  const registry = useSceneObjectRegistry()

  useEffect(() => {
    if (id && groupRef.current) {
      registry.register(id, groupRef.current)
      return () => registry.unregister(id)
    }
  }, [id, registry])

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      const axis = autoRotate.axis ?? "y"
      const speed = autoRotate.speed ?? 0.1
      groupRef.current.rotation[axis] += delta * speed
    }
  })

  const scaleArray: [number, number, number] = Array.isArray(scale) ? scale : [scale, scale, scale]

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scaleArray}>
      {children}
    </group>
  )
}
