import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDir = path.join(process.cwd(), "posts")
const dryRun = process.argv.includes("--dry-run")

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))

let modified = 0

for (const file of files) {
  const filePath = path.join(postsDir, file)
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  let changed = false

  // Add publishedAt from date if missing
  if (!data.publishedAt && data.date) {
    data.publishedAt = data.date
    changed = true
  }

  // Ensure description exists
  if (!data.description) {
    console.warn(`  ⚠ ${file}: missing description (set to empty string)`)
    data.description = ""
    changed = true
  }

  // Ensure tags is an array
  if (!Array.isArray(data.tags)) {
    console.warn(`  ⚠ ${file}: tags is not an array, defaulting to []`)
    data.tags = []
    changed = true
  }

  // Ensure bento.size exists
  if (!data.bento) {
    data.bento = { size: "1x1", cover: "image" }
    changed = true
  } else if (!data.bento.size) {
    data.bento.size = "1x1"
    changed = true
  }

  if (changed) {
    modified++
    if (dryRun) {
      console.log(`  [dry-run] Would update: ${file}`)
      console.log(`    publishedAt: ${data.publishedAt}`)
    } else {
      const updated = matter.stringify(content, data)
      fs.writeFileSync(filePath, updated, "utf8")
      console.log(`  ✓ Updated: ${file}`)
    }
  } else {
    console.log(`  ○ No changes: ${file}`)
  }
}

console.log(`\nDone. ${modified} file(s) ${dryRun ? "would be" : ""} modified.`)
