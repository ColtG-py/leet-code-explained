import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post } from '@/types/types'

export interface HeadingNode {
  depth: number
  text: string
  id: string
}

const postsDirectory = path.join(process.cwd(), 'posts')

function getPostFile(slug: string): { filePath: string; extension: string } {
  // Try .mdx first, then .md for backward compat
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)
  if (fs.existsSync(mdxPath)) return { filePath: mdxPath, extension: '.mdx' }

  const mdPath = path.join(postsDirectory, `${slug}.md`)
  if (fs.existsSync(mdPath)) return { filePath: mdPath, extension: '.md' }

  throw new Error(`Post not found: ${slug}`)
}

function extractFrontmatter(fileContents: string) {
  const matterResult = matter(fileContents)
  const wordCount = matterResult.content.split(/\s+/).filter(Boolean).length
  const readTime = matterResult.data.readTime ?? Math.ceil(wordCount / 200)

  return {
    data: matterResult.data,
    content: matterResult.content,
    readTime,
  }
}

function buildPost(id: string, data: Record<string, unknown>, readTime: number): Post {
  return {
    id,
    title: data.title as string,
    description: (data.description as string) ?? '',
    date: (data.date ?? data.publishedAt) as string,
    chapter: data.chapter as string,
    tags: data.tags as Post['tags'],
    category: data.category as Post['category'],
    readTime,
    bento: (data.bento as Post['bento']) ?? { size: '1x1', cover: 'image' },
    theme: (data.theme as Post['theme']) ?? 'dark',
  }
}

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => f.replace(/\.(mdx|md)$/, ''))
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs.map(slug => {
    const { filePath } = getPostFile(slug)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, readTime } = extractFrontmatter(fileContents)
    return buildPost(slug, data, readTime)
  })
  return posts.sort((a, b) => (a.chapter > b.chapter ? -1 : 1))
}

export function getPostSource(slug: string) {
  const { filePath } = getPostFile(slug)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content, readTime } = extractFrontmatter(fileContents)
  const post = buildPost(slug, data, readTime)

  return { post, source: content }
}

/**
 * Extract headings from raw MDX/markdown content.
 * Parses ATX-style headings (# through ####).
 */
export function extractHeadings(source: string): HeadingNode[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm
  const headings: HeadingNode[] = []
  let match

  while ((match = headingRegex.exec(source)) !== null) {
    const depth = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    headings.push({ depth, text, id })
  }

  return headings
}
