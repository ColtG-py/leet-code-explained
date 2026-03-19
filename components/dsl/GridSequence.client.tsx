"use client"

import {
  useRef,
  useEffect,
  useState,
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GridSequenceContext } from "./GridStage.client"

gsap.registerPlugin(ScrollTrigger)

interface GridInfo {
  columns: string
  rows: string
  gap: string
  element: ReactElement
  colCount: number
  rowCount: number
}

function parseGridProps(child: ReactElement): GridInfo {
  const props = child.props as Record<string, unknown>
  const columns = (props.columns as string) ?? "1fr 1fr"
  const rows = (props.rows as string) ?? "1fr 1fr"
  const gap = (props.gap as string) ?? "12px"
  return {
    columns,
    rows,
    gap,
    element: child,
    colCount: columns.trim().split(/\s+/).length,
    rowCount: rows.trim().split(/\s+/).length,
  }
}

function parseTemplate(template: string): number[] {
  return template.trim().split(/\s+/).map((v) => {
    const num = parseFloat(v)
    return isNaN(num) ? 1 : num
  })
}

function lerpTemplate(a: string, b: string, t: number): string {
  const valsA = parseTemplate(a)
  const valsB = parseTemplate(b)
  if (valsA.length !== valsB.length) return t < 0.5 ? a : b

  const unitMatch = a.trim().split(/\s+/)[0].match(/[a-z%]+$/i)
  const unit = unitMatch ? unitMatch[0] : "%"

  return valsA
    .map((va, i) => {
      const interpolated = va + (valsB[i] - va) * t
      return `${interpolated.toFixed(2)}${unit}`
    })
    .join(" ")
}

interface GridSequenceProps {
  scrollHeight?: string
  /** Fraction of scroll used for column morph transition (0-1, default 0.12) */
  transitionZone?: number
  children: ReactNode
}

export default function GridSequence({
  scrollHeight = "600vh",
  transitionZone = 0.12,
  children,
}: GridSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const prevIndexRef = useRef(0)

  const gridInfos: GridInfo[] = []
  Children.forEach(children, (child) => {
    if (isValidElement(child)) gridInfos.push(parseGridProps(child))
  })
  const gridCount = gridInfos.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !gridContainerRef.current || isMobile || gridCount < 1) return

    const gc = gridContainerRef.current

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress
        const sliceSize = 1 / gridCount
        const currentIdx = Math.min(Math.floor(progress * gridCount), gridCount - 1)
        const localProgress = (progress - currentIdx * sliceSize) / sliceSize

        const nextIdx = Math.min(currentIdx + 1, gridCount - 1)
        const currentGrid = gridInfos[currentIdx]
        const nextGrid = gridInfos[nextIdx]

        const canMorph =
          currentIdx !== nextIdx &&
          currentGrid.colCount === nextGrid.colCount &&
          currentGrid.rowCount === nextGrid.rowCount

        // Content swap: happens at the START of the transition zone
        // so the new content is in place while columns morph around it
        let displayIdx = currentIdx
        if (canMorph && localProgress > 1 - transitionZone) {
          displayIdx = nextIdx
        } else if (!canMorph && localProgress > 1 - 0.01) {
          // Non-morphable: instant swap at the very end
          displayIdx = nextIdx
        }

        if (displayIdx !== prevIndexRef.current) {
          prevIndexRef.current = displayIdx
          setActiveIndex(displayIdx)
        }

        // Column/row morph: interpolate AFTER content has swapped
        if (canMorph && localProgress > 1 - transitionZone) {
          const morphT = (localProgress - (1 - transitionZone)) / transitionZone
          const easedT = morphT * morphT * (3 - 2 * morphT) // smoothstep

          gc.style.gridTemplateColumns = lerpTemplate(currentGrid.columns, nextGrid.columns, easedT)
          gc.style.gridTemplateRows = lerpTemplate(currentGrid.rows, nextGrid.rows, easedT)
        } else {
          // Use the displayed grid's template
          const displayGrid = gridInfos[displayIdx]
          gc.style.gridTemplateColumns = displayGrid.columns
          gc.style.gridTemplateRows = displayGrid.rows
        }
      },
    })

    return () => trigger.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, gridCount])

  if (isMobile) {
    return (
      <GridSequenceContext value={true}>
        <div className="flex flex-col gap-4">{children}</div>
      </GridSequenceContext>
    )
  }

  const currentGrid = gridInfos[activeIndex] ?? gridInfos[0]
  if (!currentGrid) return null

  return (
    <GridSequenceContext value={true}>
      <div ref={containerRef} style={{ height: scrollHeight }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden p-3">
          <div
            ref={gridContainerRef}
            className="h-full w-full"
            style={{
              display: "grid",
              gridTemplateColumns: currentGrid.columns,
              gridTemplateRows: currentGrid.rows,
              gap: currentGrid.gap,
            }}
          >
            {currentGrid.element}
          </div>
        </div>
      </div>
    </GridSequenceContext>
  )
}
