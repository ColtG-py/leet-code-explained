import { Tag } from "./tags"

type Category = 'Beginner Friendly' | 'Experienced Users' | 'Theoretical / High-Level' | 'Just Chatting'

type BentoSize = '1x1' | '2x1' | '1x2' | '2x2'
type BentoCover = 'image' | 'magic-ui' | '3d'

type Post = {
    id: string
    title: string
    description: string
    date: string
    chapter: string
    tags: Tag[]
    category: Category
    readTime?: number
    bento?: {
        size: BentoSize
        cover: BentoCover
        coverImage?: string
        coverComponent?: string
        thumbnail3d?: {
            model: string
            camera?: { position: number[] }
            autoRotate?: boolean
            lighting?: string
        }
    }
    theme?: 'dark' | 'light'
}
