import { getSortedPostsData } from "@/lib/posts"
import ArticleGrid from "./components/ArticleGrid"
import Hero3D from "./components/Hero3D"

export default function Home() {
  const posts = getSortedPostsData()

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Software, explained.',
    url: 'https://www.explained.engineering',
    description: 'Articles on a wide variety of engineering concepts, broken down with interactive 3D elements.',
    author: {
      '@type': 'Person',
      name: 'Colt Gainey',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.explained.engineering/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Full-page 3D background */}
      <Hero3D />

      {/* Content layered on top */}
      <div className="relative z-10">
        {/* Title section */}
        <div className="flex items-center justify-center h-[50vh] pointer-events-none">
          <h1 style={{ fontSize: "80px" }} className="text-foreground tracking-wide drop-shadow-lg">
            Software, explained.
          </h1>
        </div>

        {/* Article grid */}
        <div className="px-6 mx-auto max-w-5xl pb-12">
          <ArticleGrid posts={posts} />
        </div>
      </div>
    </>
  )
}
