import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostSlugs, getPostSource, extractHeadings } from '@/lib/mdx'
import { mdxComponents } from '@/lib/mdx-components'
import getFormattedDate from '@/lib/getFormattedDate'
import Link from 'next/link'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { SceneRegistryProvider } from '@/components/dsl'
import TableOfContents from '@/components/article/TableOfContents'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getPostSlugs().map((postId) => ({ postId }))
}

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { postId } = await params
  try {
    const { post } = getPostSource(postId)
    return {
      title: post.title,
      description: post.description,
      authors: [{ name: 'Colt Gainey', url: 'https://www.explained.engineering' }],
      alternates: {
        canonical: `/posts/${postId}`,
      },
      openGraph: {
        title: post.title,
        description: post.description,
        url: `/posts/${postId}`,
        type: 'article',
        publishedTime: post.date,
        tags: post.tags as string[],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
      },
    }
  } catch {
    return { title: 'Post Not Found' }
  }
}

export default async function Post({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const { post, source } = getPostSource(postId)
  const headings = extractHeadings(source)
  const pubDate = getFormattedDate(post.date)

  // JSON-LD Article structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Colt Gainey',
      url: 'https://www.explained.engineering',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Software, explained.',
      url: 'https://www.explained.engineering',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.explained.engineering/posts/${postId}`,
    },
    keywords: (post.tags as string[]).join(', '),
    wordCount: post.readTime ? post.readTime * 200 : undefined,
  }

  // JSON-LD Breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.explained.engineering',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: `https://www.explained.engineering/posts/${postId}`,
      },
    ],
  }

  return (
    <SceneRegistryProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TableOfContents headings={headings} />
      <div className="px-6 mx-auto max-w-4xl pt-20">
        <h1 className="mt-8 mb-2">{post.title}</h1>
        <p className="text-sm text-muted-foreground mt-0 mb-8">
          {pubDate}
        </p>
        <article className="typography">
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, {
                    theme: 'github-dark-default',
                    keepBackground: false,
                  }],
                ],
              },
            }}
          />
          <p>
            <Link href="/">← Back to home</Link>
          </p>
        </article>
      </div>
    </SceneRegistryProvider>
  )
}
