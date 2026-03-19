"use client"

import { useEffect, useRef, useMemo, type ReactNode, Children, isValidElement } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useSceneObjectRegistry } from "./SceneObjectRegistry"
import { Vector3 } from "three"
import gsap from "gsap"
import type { KeyframeProps } from "./Keyframe"

interface ScrollTrackProps {
  children: ReactNode
  /** Scene ID to read scroll progress from. Provided automatically by Scene parent. */
  sceneProgress?: React.MutableRefObject<number>
}

interface KeyframeData extends KeyframeProps {
  at: number
}

function collectKeyframes(children: ReactNode): KeyframeData[] {
  const keyframes: KeyframeData[] = []
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.props && typeof child.props === "object" && "at" in child.props) {
      keyframes.push(child.props as KeyframeData)
    }
  })
  return keyframes.sort((a, b) => a.at - b.at)
}

export default function ScrollTrack({ children, sceneProgress }: ScrollTrackProps) {
  const objectRegistry = useSceneObjectRegistry()
  const { camera } = useThree()
  const timelinesRef = useRef<gsap.core.Timeline[]>([])
  const lookAtTarget = useRef(new Vector3())
  const keyframeData = useMemo(() => collectKeyframes(children), [children])

  useEffect(() => {
    // Kill old timelines
    timelinesRef.current.forEach((tl) => tl.kill())
    timelinesRef.current = []

    // Group keyframes by target
    const cameraKeyframes = keyframeData.filter((kf) => kf.camera)
    const targetGroups = new Map<string, KeyframeData[]>()

    for (const kf of keyframeData) {
      if (kf.target) {
        const group = targetGroups.get(kf.target) ?? []
        group.push(kf)
        targetGroups.set(kf.target, group)
      }
    }

    // Build camera timeline
    if (cameraKeyframes.length > 0) {
      const tl = gsap.timeline({ paused: true })

      for (let i = 0; i < cameraKeyframes.length; i++) {
        const kf = cameraKeyframes[i]
        const prevAt = i > 0 ? cameraKeyframes[i - 1].at : 0
        const duration = kf.at - prevAt

        if (kf.camera?.position) {
          tl.to(
            camera.position,
            {
              x: kf.camera.position[0],
              y: kf.camera.position[1],
              z: kf.camera.position[2],
              duration,
              ease: kf.easing ?? "none",
            },
            prevAt
          )
        }

        if (kf.camera?.lookAt) {
          tl.to(
            lookAtTarget.current,
            {
              x: kf.camera.lookAt[0],
              y: kf.camera.lookAt[1],
              z: kf.camera.lookAt[2],
              duration,
              ease: kf.easing ?? "none",
            },
            prevAt
          )
        }
      }

      timelinesRef.current.push(tl)
    }

    // Build object timelines
    for (const [targetId, keyframes] of targetGroups) {
      const obj = objectRegistry.get(targetId)
      if (!obj) continue

      const tl = gsap.timeline({ paused: true })

      for (let i = 0; i < keyframes.length; i++) {
        const kf = keyframes[i]
        const prevAt = i > 0 ? keyframes[i - 1].at : 0
        const duration = kf.at - prevAt

        if (kf.position) {
          tl.to(obj.position, {
            x: kf.position[0],
            y: kf.position[1],
            z: kf.position[2],
            duration,
            ease: kf.easing ?? "none",
          }, prevAt)
        }

        if (kf.rotation) {
          tl.to(obj.rotation, {
            x: kf.rotation[0],
            y: kf.rotation[1],
            z: kf.rotation[2],
            duration,
            ease: kf.easing ?? "none",
          }, prevAt)
        }

        if (kf.scale !== undefined) {
          const s = Array.isArray(kf.scale) ? kf.scale : [kf.scale, kf.scale, kf.scale]
          tl.to(obj.scale, {
            x: s[0],
            y: s[1],
            z: s[2],
            duration,
            ease: kf.easing ?? "none",
          }, prevAt)
        }

        if (kf.visible !== undefined) {
          tl.set(obj, { visible: kf.visible }, kf.at)
        }
      }

      timelinesRef.current.push(tl)
    }

    return () => {
      timelinesRef.current.forEach((tl) => tl.kill())
    }
  }, [keyframeData, camera, objectRegistry])

  useFrame(() => {
    if (!sceneProgress) return
    const progress = sceneProgress.current

    // Scrub all timelines
    for (const tl of timelinesRef.current) {
      tl.progress(progress)
    }

    // Apply lookAt if camera timeline exists and we have a target
    const cameraKfs = keyframeData.filter((kf) => kf.camera?.lookAt)
    if (cameraKfs.length > 0) {
      camera.lookAt(lookAtTarget.current)
    }
  })

  return null
}
