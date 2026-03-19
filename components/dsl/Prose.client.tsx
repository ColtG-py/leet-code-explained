"use client"

import { useRef, useEffect, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type RevealType = "fade-up" | "fade" | "slide-left" | "none"

interface ProseProps {
  slot?: string
  reveal?: RevealType
  maxWidth?: string
  padding?: string
  children: ReactNode
}

export default function Prose({
  slot,
  reveal = "fade-up",
  maxWidth = "68ch",
  padding = "2rem",
  children,
}: ProseProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reveal === "none" || !containerRef.current) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const elements = containerRef.current.querySelectorAll(":scope > *")
    const triggers: ScrollTrigger[] = []

    elements.forEach((el, i) => {
      const htmlEl = el as HTMLElement

      const fromVars: gsap.TweenVars = { opacity: 0 }
      if (reveal === "fade-up") fromVars.y = 30
      if (reveal === "slide-left") fromVars.x = 40

      gsap.set(htmlEl, fromVars)

      const tween = gsap.to(htmlEl, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.6,
        delay: i * 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: htmlEl,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    return () => {
      triggers.forEach((st) => st.kill())
    }
  }, [reveal])

  return (
    <div
      ref={containerRef}
      className="typography"
      data-slot={slot}
      style={{ maxWidth, padding }}
    >
      {children}
    </div>
  )
}
