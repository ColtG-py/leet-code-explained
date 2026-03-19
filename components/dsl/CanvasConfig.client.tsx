"use client"

import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { ACESFilmicToneMapping, SRGBColorSpace, type ToneMapping } from "three"

interface CanvasConfigProps {
  background?: string
  fog?: { color: string; near: number; far: number }
  toneMapping?: "ACESFilmic" | "Linear" | "Cineon"
  outputEncoding?: "sRGB" | "Linear"
}

const toneMappingMap: Record<string, ToneMapping> = {
  ACESFilmic: ACESFilmicToneMapping,
}

export default function CanvasConfig({
  background,
  fog,
  toneMapping,
  outputEncoding,
}: CanvasConfigProps) {
  const { gl, scene } = useThree()

  useEffect(() => {
    if (background) {
      scene.background = null // Let CSS handle background
    }
    if (toneMapping && toneMappingMap[toneMapping]) {
      gl.toneMapping = toneMappingMap[toneMapping]
    }
    if (outputEncoding === "sRGB") {
      gl.outputColorSpace = SRGBColorSpace
    }
  }, [gl, scene, background, toneMapping, outputEncoding])

  return null
}
