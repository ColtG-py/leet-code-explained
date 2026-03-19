"use client"

import { useState, useMemo } from "react"
import { Post } from "@/types/types"
import BentoCard from "./BentoCard"
import SearchBar from "./SearchBar"

interface ArticleGridProps {
  posts: Post[]
}

export default function ArticleGrid({ posts }: ArticleGridProps) {
  const [query, setQuery] = useState("")

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.toLowerCase()
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q)
    )
  }, [posts, query])

  return (
    <div>
      <div className="mb-6">
        <SearchBar onSearch={setQuery} />
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No articles found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-[20rem]">
          {filteredPosts.map((post) => (
            <BentoCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
