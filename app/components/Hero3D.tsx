"use client"

import { Suspense, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"

const ClientCanvas = dynamic(
  () => import("@/components/3d/ClientCanvas"),
  { ssr: false }
)

const HeroScene = dynamic(
  () => import("@/components/3d/HeroScene"),
  { ssr: false }
)

function GradientFallback() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-background to-accent/20" />
  )
}

function getCanRender() {
  if (typeof window === "undefined") return false
  const concurrency = navigator.hardwareConcurrency ?? 4
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
  return concurrency >= 4 && !prefersReduced
}

const subscribe = () => () => {}

export default function Hero3D() {
  const canRender = useSyncExternalStore(
    subscribe,
    getCanRender,
    () => false
  )

  return (
    <div className="fixed inset-0 z-0">
      {canRender ? (
        <Suspense fallback={<GradientFallback />}>
          <ClientCanvas
            className="h-full w-full"
            camera={{ position: [0, 0, 6], fov: 50 }}
            dpr={[1, 1.5]}
          >
            <HeroScene />
          </ClientCanvas>
        </Suspense>
      ) : (
        <GradientFallback />
      )}
    </div>
  )
}
