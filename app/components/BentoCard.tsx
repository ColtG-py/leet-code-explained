import Link from "next/link"
import { Post } from "@/types/types"
import getFormattedDate from "@/lib/getFormattedDate"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CoverBackground } from "./CoverBackground"

interface BentoCardProps {
  post: Post
}

const sizeClasses: Record<string, string> = {
  "1x1": "col-span-1 row-span-1",
  "2x1": "md:col-span-2 row-span-1",
  "1x2": "col-span-1 md:row-span-2",
  "2x2": "md:col-span-2 md:row-span-2",
}

export default function BentoCard({ post }: BentoCardProps) {
  const { id, title, description, date, tags, category, readTime, bento } = post
  const formattedDate = getFormattedDate(date)
  const size = bento?.size ?? "1x1"

  return (
    <Link
      href={`/posts/${id}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl",
        "bg-card/80 backdrop-blur-sm dark:[border:1px_solid_rgba(255,255,255,.1)]",
        "dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        "transition-all duration-300 hover:scale-[1.02]",
        sizeClasses[size]
      )}
    >
      {/* Cover background */}
      <div className="absolute inset-0 overflow-hidden">
        <CoverBackground cover={bento?.cover} coverComponent={bento?.coverComponent} thumbnail3d={bento?.thumbnail3d} />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-sm">{category}</Badge>
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-2xl text-card-foreground leading-tight mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-muted-foreground line-clamp-2 mb-3" style={{ fontSize: "28px" }}>
            {description}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
          {readTime && <span>{readTime} min read</span>}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/5" />
    </Link>
  )
}
