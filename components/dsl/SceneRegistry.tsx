"use client"

import { createContext, useContext, useRef, useCallback, type ReactNode, type MutableRefObject } from "react"

interface SceneEntry {
  progress: MutableRefObject<number>
  container: HTMLDivElement | null
}

interface SceneRegistryContextValue {
  registerScene: (id: string) => MutableRefObject<number>
  unregisterScene: (id: string) => void
  getProgress: (id: string) => MutableRefObject<number> | undefined
  moveSceneTo: (id: string, target: HTMLDivElement) => void
  getContainer: (id: string) => HTMLDivElement | null
}

const SceneRegistryContext = createContext<SceneRegistryContextValue | null>(null)

export function useSceneRegistry() {
  const ctx = useContext(SceneRegistryContext)
  if (!ctx) throw new Error("useSceneRegistry must be used within <SceneRegistryProvider>")
  return ctx
}

export function SceneRegistryProvider({ children }: { children: ReactNode }) {
  const scenes = useRef(new Map<string, SceneEntry>())

  const registerScene = useCallback((id: string) => {
    if (!scenes.current.has(id)) {
      scenes.current.set(id, {
        progress: { current: 0 },
        container: null,
      })
    }
    return scenes.current.get(id)!.progress
  }, [])

  const unregisterScene = useCallback((id: string) => {
    scenes.current.delete(id)
  }, [])

  const getProgress = useCallback((id: string) => {
    return scenes.current.get(id)?.progress
  }, [])

  const moveSceneTo = useCallback((id: string, target: HTMLDivElement) => {
    const entry = scenes.current.get(id)
    if (entry?.container && target !== entry.container.parentElement) {
      target.appendChild(entry.container)
    }
  }, [])

  const getContainer = useCallback((id: string) => {
    return scenes.current.get(id)?.container ?? null
  }, [])

  const value: SceneRegistryContextValue = {
    registerScene,
    unregisterScene,
    getProgress,
    moveSceneTo,
    getContainer,
  }

  return (
    <SceneRegistryContext value={value}>
      {children}
    </SceneRegistryContext>
  )
}
