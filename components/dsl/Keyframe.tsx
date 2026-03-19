/**
 * Data-only component — renders nothing.
 * ScrollTrack reads its props to build GSAP timelines.
 */

export interface KeyframeProps {
  at: number // 0-1 normalized scroll progress
  target?: string // id of Model, Group, etc.
  camera?: {
    position?: [number, number, number]
    lookAt?: [number, number, number]
    fov?: number
  }
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  visible?: boolean
  easing?: string // GSAP ease string
}

export default function Keyframe(_props: KeyframeProps) {
  return null
}
