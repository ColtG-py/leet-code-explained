// Deprecated: re-exports from lib/mdx.ts for backward compatibility
import { getAllPosts, getPostSource } from './mdx'

export function getSortedPostsData() {
  return getAllPosts()
}

export async function getPostData(id: string) {
  const { post, source } = getPostSource(id)
  return {
    ...post,
    contentHtml: source, // raw MDX source, not compiled HTML
  }
}
