import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import { robotoMono } from "../fonts"

type Props = {
    post: Post
}

export default function ListItem({ post }: Props) {
    const { id, title, date } = post
    const formattedDate = getFormattedDate(date)

    return (
        <li style={robotoMono.style} className="mt-4 text-2xl  dark:text-white/90">
            <Link className="hover:text-black/70 dark:hover:text-white" href={`/posts/${id}`}>{title}</Link>
            <br />
            <p className="text-sm mt-1 animate-pulse">{formattedDate}</p>
        </li>
    )
}