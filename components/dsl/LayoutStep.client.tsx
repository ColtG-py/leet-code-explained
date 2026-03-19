"use client"

import { useRef, useEffect, Children, isValidElement, type ReactNode } from "react"
import { layoutPresets } from "./layouts"

interface LayoutStepProps {
  layout: string
  ratio?: string
  scrollHeight?: string
  transition?: string
  children: ReactNode
}

function getSlot(child: ReactNode): string | undefined {
  if (isValidElement(child) && child.props && typeof child.props === "object" && "slot" in child.props) {
    return (child.props as { slot?: string }).slot
  }
  return undefined
}

export default function LayoutStep({
  layout,
  ratio,
  scrollHeight,
  children,
}: LayoutStepProps) {
  const ref = useRef<HTMLDivElement>(null)
  const presetFn = layoutPresets[layout] ?? layoutPresets["prose-only"]
  const preset = presetFn(ratio)

  // Distribute children into grid areas based on slot prop
  const slots = new Map<string, ReactNode[]>()
  const unslotted: ReactNode[] = []

  Children.forEach(children, (child) => {
    const slot = getSlot(child)
    if (slot) {
      const list = slots.get(slot) ?? []
      list.push(child)
      slots.set(slot, list)
    } else {
      unslotted.push(child)
    }
  })

  // Extract area names from gridTemplateAreas
  const areaNames = preset.gridTemplateAreas
    .replace(/"/g, "")
    .split(/\s+/)
    .filter((name, index, arr) => arr.indexOf(name) === index && name !== ".")

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: preset.gridTemplateColumns,
        gridTemplateAreas: preset.gridTemplateAreas,
        minHeight: preset.minHeight ?? scrollHeight,
        gap: "1rem",
      }}
    >
      {areaNames.map((area) => (
        <div key={area} style={{ gridArea: area }}>
          {slots.get(area)}
        </div>
      ))}

      {/* Unslotted children go into the first area */}
      {unslotted.length > 0 && (
        <div style={{ gridArea: areaNames[0] }}>
          {unslotted}
        </div>
      )}
    </div>
  )
}
