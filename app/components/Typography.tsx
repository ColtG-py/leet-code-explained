import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface TypographyProps {
  children: ReactNode
  className?: string
}

/**
 * Typography wrapper for Monogram pixel font.
 * Applies proper heading hierarchy and spacing for article content.
 * Use this to wrap any rendered HTML/markdown content.
 */
export default function Typography({ children, className }: TypographyProps) {
  return (
    <div
      className={cn(
        "typography",
        className
      )}
    >
      {children}
    </div>
  )
}
