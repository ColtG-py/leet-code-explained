import { ImageResponse } from "next/og"
import { getPostSource } from "@/lib/mdx"

export const runtime = "nodejs"
export const alt = "Article"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params

  let title = postId
  let description = ""
  let tags: string[] = []

  try {
    const { post } = getPostSource(postId)
    title = post.title
    description = post.description
    tags = post.tags as string[]
  } catch {
    // fallback to slug
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0f0a1a 0%, #1a1030 40%, #0d0d1a 100%)",
          position: "relative",
        }}
      >
        {/* Decorative orb */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #7c3aed 0%, #4c1d95 40%, transparent 70%)",
            top: "-50px",
            right: "-50px",
            opacity: 0.3,
            display: "flex",
          }}
        />

        {/* Top: site name */}
        <div
          style={{
            fontSize: "24px",
            color: "#7c6b9a",
            letterSpacing: "2px",
            display: "flex",
          }}
        >
          Software, explained.
        </div>

        {/* Middle: article title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? "48px" : "56px",
              color: "#e8e0f0",
              lineHeight: 1.2,
              display: "flex",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: "26px",
                color: "#9585b0",
                display: "flex",
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom: tags + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: "20px",
                  color: "#a78bfa",
                  border: "1px solid #4c1d95",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  display: "flex",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "20px", color: "#6b5b80", display: "flex" }}>
            explained.engineering
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
