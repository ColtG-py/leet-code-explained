import fs from "fs"
import path from "path"

const postsDir = path.join(process.cwd(), "posts")

// Parse args
const args = process.argv.slice(2)
const flags = args.filter((a) => a.startsWith("--"))
const positional = args.filter((a) => !a.startsWith("--"))

const title = positional[0]
if (!title) {
  console.error("Usage: npx tsx scripts/new-article.ts \"Article Title\" [--3d] [--layout]")
  process.exit(1)
}

const include3d = flags.includes("--3d")
const includeLayout = flags.includes("--layout")

// Generate slug
const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "-")

const filePath = path.join(postsDir, `${slug}.mdx`)

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`)
  process.exit(1)
}

// Find next chapter number
const existing = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
let maxChapter = 0
for (const file of existing) {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8")
  const match = raw.match(/chapter:\s*['"]?(\d+)['"]?/)
  if (match) maxChapter = Math.max(maxChapter, parseInt(match[1]))
}
const nextChapter = maxChapter + 1

const today = new Date().toISOString().split("T")[0]

let content = `---
title: '${title}'
description: ''
date: '${today}'
publishedAt: '${today}'
chapter: '${nextChapter}'
tags: []
category: 'Beginner Friendly'
bento:
  size: '1x1'
  cover: 'image'
---

# ${title}

Start writing here.
`

if (include3d) {
  content += `
<Scene id="${slug}-scene" scrollHeight="200vh" background="#050a1a" environment="night">
  <Lighting preset="studio" />
</Scene>
`
}

if (includeLayout) {
  content += `
<LayoutStep layout="prose-only">
  <Prose slot="main" reveal="fade-up">

## Section Title

Your content here.

  </Prose>
</LayoutStep>
`
}

fs.writeFileSync(filePath, content, "utf8")
console.log(`Created: ${filePath}`)
