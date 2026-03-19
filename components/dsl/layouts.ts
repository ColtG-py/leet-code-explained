export interface LayoutPreset {
  gridTemplateColumns: string
  gridTemplateAreas: string
  minHeight?: string
}

export function resolveRatio(ratio: string): { left: string; right: string } {
  const parts = ratio.split("/").map((s) => s.trim())
  if (parts.length !== 2) return { left: "1fr", right: "1fr" }
  return { left: `${parts[0]}fr`, right: `${parts[1]}fr` }
}

export const layoutPresets: Record<string, (ratio?: string) => LayoutPreset> = {
  hero: () => ({
    gridTemplateColumns: "1fr",
    gridTemplateAreas: '"main"',
    minHeight: "100vh",
  }),

  split: (ratio = "50/50") => {
    const r = resolveRatio(ratio)
    return {
      gridTemplateColumns: `${r.left} ${r.right}`,
      gridTemplateAreas: '"left right"',
    }
  },

  "split-left": (ratio = "50/50") => {
    const r = resolveRatio(ratio)
    return {
      gridTemplateColumns: `${r.left} ${r.right}`,
      gridTemplateAreas: '"left right"',
    }
  },

  "split-right": (ratio = "50/50") => {
    const r = resolveRatio(ratio)
    return {
      gridTemplateColumns: `${r.left} ${r.right}`,
      gridTemplateAreas: '"left right"',
    }
  },

  "grid-2x2": (ratio = "50/50") => {
    const r = resolveRatio(ratio)
    return {
      gridTemplateColumns: `${r.left} ${r.right}`,
      gridTemplateAreas: '"top-left top-right" "bottom-left bottom-right"',
    }
  },

  "prose-only": () => ({
    gridTemplateColumns: "1fr min(68ch, 100%) 1fr",
    gridTemplateAreas: '". main ."',
  }),

  "wide-prose": () => ({
    gridTemplateColumns: "1fr",
    gridTemplateAreas: '"main"',
  }),
}
