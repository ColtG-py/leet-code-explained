"use client"

import { Text, Billboard } from "@react-three/drei"

interface LabelProps {
  text: string
  position?: [number, number, number]
  font?: "display" | "mono" | "body"
  size?: number
  color?: string
  billboard?: boolean
}

export default function Label({
  text,
  position = [0, 0, 0],
  size = 0.12,
  color = "#ffffff",
  billboard = false,
}: LabelProps) {
  const textElement = (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )

  if (billboard) {
    return <Billboard>{textElement}</Billboard>
  }

  return textElement
}
