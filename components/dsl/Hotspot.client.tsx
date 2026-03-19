"use client"

import { useState } from "react"
import { Html } from "@react-three/drei"

interface HotspotProps {
  id?: string
  position?: [number, number, number]
  label?: string
  description?: string
  trigger?: "click" | "hover" | "scroll"
  scrollAt?: number
  sceneProgress?: React.MutableRefObject<number>
}

export default function Hotspot({
  position = [0, 0, 0],
  label,
  description,
  trigger = "click",
}: HotspotProps) {
  const [active, setActive] = useState(false)

  const handlers =
    trigger === "click"
      ? { onClick: () => setActive(!active) }
      : trigger === "hover"
        ? { onPointerEnter: () => setActive(true), onPointerLeave: () => setActive(false) }
        : {}

  return (
    <group position={position}>
      <Html center distanceFactor={8} {...handlers}>
        <div className="relative cursor-pointer select-none">
          {/* Pulsing ring */}
          <div
            className="rounded-full border-2 border-primary animate-ping absolute inset-0"
            style={{ width: "20px", height: "20px", opacity: active ? 0 : 0.6 }}
          />
          <div
            className="rounded-full bg-primary"
            style={{ width: "20px", height: "20px", opacity: 0.8 }}
          />

          {/* Expanded card */}
          {active && (label || description) && (
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg whitespace-nowrap"
              style={{ fontSize: "20px", minWidth: "200px" }}
            >
              {label && <div className="font-bold text-foreground mb-1">{label}</div>}
              {description && <div className="text-muted-foreground">{description}</div>}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
