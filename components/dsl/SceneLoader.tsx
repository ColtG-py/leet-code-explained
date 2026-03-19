"use client"

interface SceneLoaderProps {
  style?: "spinner" | "bar" | "pulse"
  color?: string
}

export default function SceneLoader({ style = "pulse", color }: SceneLoaderProps) {
  const c = color ?? "var(--primary)"

  if (style === "spinner") {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div
          className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: c, borderTopColor: "transparent" }}
        />
      </div>
    )
  }

  if (style === "bar") {
    return (
      <div className="flex items-end justify-center h-full w-full pb-8">
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
          <div
            className="h-full w-1/3 rounded-full animate-pulse"
            style={{ background: c }}
          />
        </div>
      </div>
    )
  }

  // pulse (default)
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className="h-16 w-16 rounded-full animate-pulse"
        style={{ background: c, opacity: 0.3 }}
      />
    </div>
  )
}
