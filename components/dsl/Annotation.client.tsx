"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useSceneObjectRegistry } from "./SceneObjectRegistry"
import { Vector3 } from "three"

interface AnnotationProps {
  target?: string
  label?: string
  connector?: boolean
  visibleAt?: { scrollStart: number; scrollEnd: number }
  position?: [number, number, number]
  sceneProgress?: React.MutableRefObject<number>
}

export default function Annotation({
  target,
  label,
  connector = false,
  visibleAt,
  position = [0, 1, 0],
  sceneProgress,
}: AnnotationProps) {
  const registry = useSceneObjectRegistry()
  const { camera, size } = useThree()
  const [visible, setVisible] = useState(!visibleAt)
  const [connectorLine, setConnectorLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  const worldPos = useRef(new Vector3())
  const targetWorldPos = useRef(new Vector3())

  useFrame(() => {
    // Scroll-gated visibility
    if (visibleAt && sceneProgress) {
      const p = sceneProgress.current
      setVisible(p >= visibleAt.scrollStart && p <= visibleAt.scrollEnd)
    }

    // Update connector line
    if (connector && target && visible) {
      const obj = registry.get(target)
      if (obj) {
        obj.getWorldPosition(targetWorldPos.current)
        const targetScreen = targetWorldPos.current.clone().project(camera)

        worldPos.current.set(...position)
        const annotScreen = worldPos.current.clone().project(camera)

        setConnectorLine({
          x1: (annotScreen.x * 0.5 + 0.5) * size.width,
          y1: (-annotScreen.y * 0.5 + 0.5) * size.height,
          x2: (targetScreen.x * 0.5 + 0.5) * size.width,
          y2: (-targetScreen.y * 0.5 + 0.5) * size.height,
        })
      }
    }
  })

  if (!visible) return null

  return (
    <>
      <group position={position}>
        <Html center distanceFactor={8}>
          <div
            className="bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap text-foreground"
            style={{ fontSize: "20px" }}
          >
            {label}
          </div>
        </Html>
      </group>

      {/* SVG connector rendered as HTML overlay */}
      {connector && connectorLine && (
        <Html
          fullscreen
          style={{ pointerEvents: "none" }}
        >
          <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
            <line
              x1={connectorLine.x1}
              y1={connectorLine.y1}
              x2={connectorLine.x2}
              y2={connectorLine.y2}
              stroke="var(--primary)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </svg>
        </Html>
      )}
    </>
  )
}
