"use client"

import { useSceneRegistry } from "./SceneRegistry"

/**
 * Hook to read the current scene's scroll progress ref.
 * Use inside useFrame callbacks for zero-rerender scroll tracking.
 */
export function useScrollProgress(sceneId: string) {
  const registry = useSceneRegistry()
  return registry.getProgress(sceneId)
}
