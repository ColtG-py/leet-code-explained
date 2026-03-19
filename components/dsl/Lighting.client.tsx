"use client"

import type { ReactNode } from "react"

type LightingPreset = "studio" | "space" | "warm" | "cool" | "dramatic"

interface LightingProps {
  preset?: LightingPreset
  children?: ReactNode
}

const presets: Record<LightingPreset, ReactNode> = {
  studio: (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, -2, 0]} intensity={0.2} />
    </>
  ),
  space: (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 5, 5]} intensity={1.5} castShadow color="#FDB813" />
    </>
  ),
  warm: (
    <>
      <ambientLight intensity={0.3} color="#fff5e6" />
      <directionalLight position={[5, 5, 2]} intensity={1.0} color="#ffcc80" castShadow />
      <pointLight position={[-3, 1, -2]} intensity={0.4} color="#ff8a65" />
    </>
  ),
  cool: (
    <>
      <ambientLight intensity={0.3} color="#e3f2fd" />
      <directionalLight position={[3, 5, 5]} intensity={0.9} color="#90caf9" castShadow />
      <pointLight position={[-2, 2, -3]} intensity={0.3} color="#64b5f6" />
    </>
  ),
  dramatic: (
    <>
      <ambientLight intensity={0.05} />
      <spotLight position={[5, 8, 3]} intensity={2.0} angle={0.4} penumbra={0.5} castShadow />
      <pointLight position={[-4, -2, -3]} intensity={0.3} color="#7c3aed" />
    </>
  ),
}

export default function Lighting({ preset, children }: LightingProps) {
  if (children) return <>{children}</>
  if (preset && presets[preset]) return <>{presets[preset]}</>
  return <>{presets.studio}</>
}
