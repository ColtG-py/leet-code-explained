"use client"

import { Canvas, type CanvasProps } from "@react-three/fiber"
import { type ReactNode } from "react"

interface ClientCanvasProps extends Omit<CanvasProps, "children"> {
  children: ReactNode
  className?: string
}

export default function ClientCanvas({
  children,
  className,
  ...props
}: ClientCanvasProps) {
  return (
    <Canvas
      className={className}
      gl={{ antialias: true }}
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
      {...props}
    >
      {children}
    </Canvas>
  )
}
