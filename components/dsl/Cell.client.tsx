"use client"

import type { ReactNode, CSSProperties } from "react"

export interface CellProps {
  /** CSS grid row (e.g., "1", "2", "1 / span 2") */
  row?: string | number
  /** CSS grid column (e.g., "1", "2", "1 / span 2") */
  col?: string | number
  /** Shorthand grid-area */
  area?: string
  className?: string
  children: ReactNode
  // Legacy props kept for compat
  slot?: string
  id?: string
}

/**
 * A grid cell that positions itself within a GridStage.
 */
export default function Cell({
  row,
  col,
  area,
  className = "",
  children,
}: CellProps) {
  const style: CSSProperties = {}
  if (area) style.gridArea = area
  if (row) style.gridRow = row
  if (col) style.gridColumn = col

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
