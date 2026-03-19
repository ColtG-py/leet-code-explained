"use client"

import { createContext, useContext, useRef, useCallback, type ReactNode } from "react"
import type { Object3D } from "three"

interface SceneObjectRegistryContextValue {
  register: (id: string, obj: Object3D) => void
  unregister: (id: string) => void
  get: (id: string) => Object3D | undefined
}

const SceneObjectRegistryContext = createContext<SceneObjectRegistryContextValue | null>(null)

export function useSceneObjectRegistry() {
  const ctx = useContext(SceneObjectRegistryContext)
  if (!ctx) throw new Error("useSceneObjectRegistry must be used within <SceneObjectRegistryProvider>")
  return ctx
}

export function SceneObjectRegistryProvider({ children }: { children: ReactNode }) {
  const objects = useRef(new Map<string, Object3D>())

  const register = useCallback((id: string, obj: Object3D) => {
    objects.current.set(id, obj)
  }, [])

  const unregister = useCallback((id: string) => {
    objects.current.delete(id)
  }, [])

  const get = useCallback((id: string) => {
    return objects.current.get(id)
  }, [])

  return (
    <SceneObjectRegistryContext value={{ register, unregister, get }}>
      {children}
    </SceneObjectRegistryContext>
  )
}
