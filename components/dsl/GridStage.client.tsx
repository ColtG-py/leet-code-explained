"use client"

import { createContext, useContext, useRef, useEffect, useState, type ReactNode } from "react"

// Context to detect if we're inside a GridSequence
export const GridSequenceContext = createContext(false)

interface GridStageProps {
  scrollHeight?: string
  columns?: string
  rows?: string
  gap?: string
  children: ReactNode
}

export default function GridStage({
  scrollHeight = "300vh",
  columns = "1fr 1fr",
  rows = "1fr 1fr",
  gap = "12px",
  children,
}: GridStageProps) {
  const isInsideSequence = useContext(GridSequenceContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (isMobile) {
    return <div className="flex flex-col gap-4">{children}</div>
  }

  // Just the grid — used inside GridSequence or standalone
  const grid = (
    <div
      className="h-full w-full overflow-hidden p-3"
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gap,
      }}
    >
      {children}
    </div>
  )

  // Inside GridSequence: render children directly (GridSequence provides the grid container)
  if (isInsideSequence) {
    return <>{children}</>
  }

  // Standalone: wrap with scroll container + sticky
  return (
    <div ref={containerRef} style={{ height: scrollHeight, margin: 0, padding: 0 }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {grid}
      </div>
    </div>
  )
}
