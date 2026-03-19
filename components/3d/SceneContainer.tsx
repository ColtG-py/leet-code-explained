"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface SceneContainerProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
  /** Minimum hardware concurrency to render 3D (default: 4) */
  minConcurrency?: number
}

export default function SceneContainer({
  children,
  fallback,
  className,
  minConcurrency = 4,
}: SceneContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [canRender3D, setCanRender3D] = useState(true)

  useEffect(() => {
    // Check hardware capability
    const concurrency = navigator.hardwareConcurrency ?? 4
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (concurrency < minConcurrency || prefersReducedMotion) {
      setCanRender3D(false)
      return
    }

    // Lazy mount via IntersectionObserver
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [minConcurrency])

  return (
    <div ref={ref} className={className}>
      {canRender3D && isVisible ? children : fallback}
    </div>
  )
}
