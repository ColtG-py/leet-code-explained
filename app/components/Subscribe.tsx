"use client";

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function Subscribe() {
    const [value, setValue] = useState("")

    const subscribe = async (email: string) => {
        if (email.length < 5) return

        const res = await fetch('/api/subscribe', {
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        })

        await res.json()

        toast({
            title: "Thanks, you've subscribed",
            description: "You'll be sent an email the next time an article is posted."
        })

        setValue("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            subscribe(value)
        }
    }

    return (
        <input
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="get-notified@email.com"
            className="h-8 w-52 rounded-full bg-background/50 border border-border px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ fontSize: "18px" }}
        />
    )
}
