"use client"

import { useThree, useFrame } from "@react-three/fiber"
import { useRef } from "react"

/**
 * Keeps the camera projection stable when the canvas resizes.
 * Adjusts the camera distance to maintain consistent object sizing
 * regardless of the canvas aspect ratio.
 */
export default function AdaptiveCamera() {
  const { camera, size } = useThree()
  const initialAspect = useRef<number | null>(null)
  const initialZ = useRef<number | null>(null)

  useFrame(() => {
    const currentAspect = size.width / size.height

    // Record initial state on first frame
    if (initialAspect.current === null) {
      initialAspect.current = currentAspect
      initialZ.current = camera.position.z
      return
    }

    // Adjust camera Z to compensate for aspect ratio changes
    // When the cell gets narrower, pull camera back to keep objects visible
    if (initialZ.current !== null) {
      const aspectRatio = initialAspect.current / currentAspect
      // Only adjust if aspect changed significantly (narrower = pull back)
      if (currentAspect < initialAspect.current) {
        camera.position.z = initialZ.current * Math.max(1, aspectRatio * 0.8)
      } else {
        camera.position.z = initialZ.current
      }
    }
  })

  return null
}
