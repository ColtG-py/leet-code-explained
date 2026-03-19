"use client"

import { SceneRegistryProvider } from "@/components/dsl/SceneRegistry"
import type { ReactNode } from "react"

interface ArticleLayoutProps {
  children: ReactNode
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <SceneRegistryProvider>
      {children}
    </SceneRegistryProvider>
  )
}
