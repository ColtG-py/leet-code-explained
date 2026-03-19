import type { ReactNode } from "react"

// GridState is no longer used by GridStage but kept for backward compat
export interface GridStateProps {
  at?: number
  layout?: string
  ratio?: string
  children: ReactNode
}

export default function GridState({ children }: GridStateProps) {
  return <>{children}</>
}
