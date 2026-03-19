"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"

interface CameraRigProps {
  mode?: "orbit" | "fly" | "pan" | "static"
  target?: [number, number, number]
  radius?: number
  scrollDriven?: boolean
  autoRotate?: { speed?: number }
  enableDamping?: boolean
  /** Scroll progress ref — provided by Scene parent */
  sceneProgress?: React.MutableRefObject<number>
}

export default function CameraRig({
  mode = "static",
  target = [0, 0, 0],
  radius = 8,
  scrollDriven = false,
  autoRotate,
  sceneProgress,
}: CameraRigProps) {
  const { camera } = useThree()
  const targetVec = useRef(new Vector3(...target))
  const angleRef = useRef(0)

  useFrame((_, delta) => {
    if (mode === "static") return

    if (mode === "orbit") {
      if (scrollDriven && sceneProgress) {
        angleRef.current = sceneProgress.current * Math.PI * 2
      } else if (autoRotate) {
        angleRef.current += delta * (autoRotate.speed ?? 0.3)
      }

      camera.position.x = targetVec.current.x + Math.cos(angleRef.current) * radius
      camera.position.z = targetVec.current.z + Math.sin(angleRef.current) * radius
      camera.lookAt(targetVec.current)
    }
  })

  return null
}
