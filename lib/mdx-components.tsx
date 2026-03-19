import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'
import CodeBlock from '@/components/mdx/CodeBlock'
import MDXImage from '@/components/mdx/MDXImage'
import {
  Scene, Model, Group, Lighting, CanvasConfig,
  ScrollTrack, Keyframe, CameraRig,
  LayoutStep, Prose,
  Hotspot, Label, Annotation,
  GridStage, GridState, Cell, GridSequence,
} from '@/components/dsl'

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const
  return function Heading(props: ComponentPropsWithoutRef<typeof Tag>) {
    return <Tag {...props} />
  }
}

function MDXLink(props: ComponentPropsWithoutRef<'a'>) {
  const href = props.href ?? ''
  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link href={href} {...props} />
  }
  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

const htmlComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: MDXLink,
  img: MDXImage as MDXComponents['img'],
  pre: CodeBlock as MDXComponents['pre'],
}

// All DSL components available in MDX without imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dslComponents: Record<string, any> = {
  Scene,
  Model,
  Group,
  Lighting,
  CanvasConfig,
  ScrollTrack,
  Keyframe,
  CameraRig,
  LayoutStep,
  Prose,
  Hotspot,
  Label,
  Annotation,
  GridStage,
  GridState,
  Cell,
  GridSequence,
}

export const mdxComponents: MDXComponents = {
  ...htmlComponents,
  ...(dslComponents as MDXComponents),
}
