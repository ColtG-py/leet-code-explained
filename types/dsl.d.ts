import type { Post } from './types'

export type MDXFrontmatter = Post & {
  publishedAt?: string
}

export type HeadingNode = {
  depth: number
  text: string
  id: string
}

export type SceneEntry = {
  id: string
  label: string
}
