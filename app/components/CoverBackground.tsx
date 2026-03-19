"use client"

import dynamic from "next/dynamic"
import { Meteors } from "@/components/ui/meteors"
import { Particles } from "@/components/ui/particles"

const ThumbnailCanvas = dynamic(
  () => import("@/components/3d/ThumbnailCanvas"),
  { ssr: false }
)

interface CoverBackgroundProps {
  cover?: string
  coverComponent?: string
  thumbnail3d?: {
    model: string
    camera?: { position: number[] }
    autoRotate?: boolean
    lighting?: string
  }
}

const componentMap: Record<string, React.FC> = {
  Meteors: () => <Meteors number={12} />,
  Particles: () => (
    <Particles
      className="absolute inset-0"
      quantity={40}
      color="#8b5cf6"
      size={0.5}
    />
  ),
}

export function CoverBackground({
  cover,
  coverComponent,
  thumbnail3d,
}: CoverBackgroundProps) {
  if (cover === "3d" && thumbnail3d) {
    return <ThumbnailCanvas {...thumbnail3d} />
  }

  if (cover === "magic-ui" && coverComponent && componentMap[coverComponent]) {
    const Component = componentMap[coverComponent]
    return <Component />
  }

  // Default gradient for image or fallback
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
  )
}
