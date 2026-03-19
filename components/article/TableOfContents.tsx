"use client"

import { useEffect, useState, useCallback } from "react"
import type { HeadingNode } from "@/lib/mdx"

interface SceneEntry {
  id: string
  label: string
}

interface TableOfContentsProps {
  headings: HeadingNode[]
  scenes?: SceneEntry[]
}

const dashWidths: Record<number, number> = {
  1: 56,
  2: 40,
  3: 28,
  4: 18,
}

export default function TableOfContents({ headings, scenes = [] }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [hovered, setHovered] = useState(false)
  const [collapsed, setCollapsed] = useState(true)

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-10% 0px -70% 0px" }
    )

    headingElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [])

  type TocEntry = { type: "heading"; heading: HeadingNode } | { type: "scene"; scene: SceneEntry }
  const entries: TocEntry[] = [
    ...headings.map((h) => ({ type: "heading" as const, heading: h })),
    ...scenes.map((s) => ({ type: "scene" as const, scene: s })),
  ]

  return (
    <>
      {/* Desktop: fixed left rail with hover-expand */}
      <nav
        className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Collapsed: dash rail */}
        <div
          className="transition-all duration-300"
          style={{ opacity: hovered ? 0 : 1, pointerEvents: hovered ? "none" : "auto" }}
        >
          <div className="flex flex-col gap-3 p-2">
            {entries.map((entry, i) => {
              if (entry.type === "heading") {
                const h = entry.heading
                const isActive = activeId === h.id
                const width = dashWidths[h.depth] ?? 18

                return (
                  <button
                    key={`h-${i}`}
                    onClick={() => scrollTo(h.id)}
                    className="flex items-center"
                  >
                    <div
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: `${isActive ? width + 8 : width}px`,
                        height: "4px",
                        backgroundColor: isActive ? "var(--primary)" : "var(--muted-foreground)",
                        opacity: isActive ? 1 : 0.4,
                      }}
                    />
                  </button>
                )
              }

              const s = entry.scene
              return (
                <button
                  key={`s-${i}`}
                  onClick={() => scrollTo(s.id)}
                  className="flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 10 10" className="text-primary opacity-60">
                    <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" />
                  </svg>
                  <div
                    className="rounded-full"
                    style={{
                      width: "24px",
                      height: "4px",
                      backgroundColor: "var(--primary)",
                      opacity: 0.5,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Expanded: full TOC panel on hover */}
        <div
          className="absolute top-0 left-0 transition-all duration-300 origin-top-left"
          style={{
            opacity: hovered ? 1 : 0,
            transform: `scale(${hovered ? 1 : 0.95})`,
            pointerEvents: hovered ? "auto" : "none",
          }}
        >
          <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl min-w-[280px]">
            <div className="flex flex-col gap-1">
              {entries.map((entry, i) => {
                if (entry.type === "heading") {
                  const h = entry.heading
                  const isActive = activeId === h.id
                  const indent = (h.depth - 1) * 16

                  return (
                    <button
                      key={`eh-${i}`}
                      onClick={() => scrollTo(h.id)}
                      className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-left transition-colors hover:bg-muted/50"
                      style={{ paddingLeft: `${indent + 8}px` }}
                    >
                      <div
                        className="rounded-full shrink-0"
                        style={{
                          width: `${dashWidths[h.depth] ?? 18}px`,
                          height: "4px",
                          backgroundColor: isActive ? "var(--primary)" : "var(--muted-foreground)",
                          opacity: isActive ? 1 : 0.35,
                        }}
                      />
                      <span
                        className="transition-colors truncate"
                        style={{
                          fontSize: "24px",
                          color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                        }}
                      >
                        {h.text}
                      </span>
                    </button>
                  )
                }

                const s = entry.scene
                return (
                  <button
                    key={`es-${i}`}
                    onClick={() => scrollTo(s.id)}
                    className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-left transition-colors hover:bg-muted/50"
                  >
                    <svg width="12" height="12" viewBox="0 0 10 10" className="text-primary shrink-0">
                      <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" />
                    </svg>
                    <span className="text-muted-foreground truncate" style={{ fontSize: "24px" }}>
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Tablet: collapsible toggle */}
      <nav className="hidden md:block lg:hidden fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full bg-card/80 backdrop-blur-md border border-border p-2 shadow-lg text-muted-foreground hover:text-foreground"
          style={{ fontSize: "20px" }}
        >
          {collapsed ? "|||" : "x"}
        </button>
        {!collapsed && (
          <div className="mt-2 flex flex-col gap-2 bg-card/80 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg">
            {headings.map((h, i) => (
              <button
                key={i}
                onClick={() => { scrollTo(h.id); setCollapsed(true) }}
                className="text-left text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: "22px", paddingLeft: `${(h.depth - 1) * 12}px` }}
              >
                {h.text}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
