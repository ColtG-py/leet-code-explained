"use client"

import { useState, useCallback } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("")

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value
      setValue(query)
      onSearch(query)
    },
    [onSearch]
  )

  return (
    <div className="w-full max-w-xs">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search articles..."
        className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
