"use client"

import { useState, type ComponentPropsWithoutRef } from "react"

export default function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const code = (props as { children?: { props?: { children?: string } } })
      ?.children?.props?.children
    if (typeof code === "string") {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Extract language from className (e.g. "language-python")
  const childProps = (props as { children?: { props?: Record<string, unknown> } })
    ?.children?.props
  const className = (childProps?.className as string) ?? ""
  const lang = className.replace("language-", "")

  return (
    <div className="relative group my-6">
      {lang && (
        <span
          className="absolute top-2 left-4 text-muted-foreground opacity-60"
          style={{ fontSize: "18px", fontFamily: "monospace" }}
        >
          {lang}
        </span>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground rounded px-2 py-1 border border-border"
        style={{ fontSize: "18px", fontFamily: "monospace" }}
      >
        {copied ? "copied" : "copy"}
      </button>
      <pre
        {...props}
        className="overflow-x-auto rounded-lg bg-[var(--muted)] p-4 pt-10"
        style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace", fontSize: "24px", lineHeight: "1.6" }}
      />
    </div>
  )
}
