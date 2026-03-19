"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { FaCoffee, FaGithub, FaHome } from "react-icons/fa"
import Subscribe from "./Subscribe"

const capsuleStyle =
  "flex items-center gap-3 rounded-full bg-card/80 backdrop-blur-md border border-border px-5 py-2 shadow-lg whitespace-nowrap"

export default function CapsuleHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [splitProgress, setSplitProgress] = useState(0)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 200, 1)
      setSplitProgress(progress)

      if (isHome) {
        const heroHeight = window.innerHeight * 0.5
        setShowTitle(window.scrollY > heroHeight - 60)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHome])

  const titleOpacity = isHome && showTitle ? 1 : 0

  return (
    <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none px-6">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center">
        {/* Left capsule */}
        <div className="pointer-events-auto">
          <div className={capsuleStyle}>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" title="Home">
              <FaHome size={24} />
            </Link>
            <div className="w-px h-6 bg-border" />
            <Subscribe />
          </div>
        </div>

        {/* Center spacer — grows with scroll to push capsules apart */}
        <div className="relative flex items-center justify-center" style={{ width: `${splitProgress * 60}vw` }}>
          {isHome && (
            <span
              className="absolute text-foreground tracking-wide pointer-events-none"
              style={{
                fontSize: "28px",
                opacity: titleOpacity,
                transition: "opacity 0.3s ease",
              }}
            >
              Software, explained.
            </span>
          )}
        </div>

        {/* Right capsule */}
        <div className="pointer-events-auto">
          <div className={capsuleStyle}>
            <Link href="https://github.com/ColtG-py/leet-code-explained" className="text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
              <FaGithub size={24} />
            </Link>
            <Link href="https://ko-fi.com/coltgainey" className="text-muted-foreground hover:text-foreground transition-colors" title="Ko-fi">
              <FaCoffee size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: single centered capsule */}
      <div className="flex md:hidden justify-center pointer-events-auto">
        <div className={capsuleStyle}>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" title="Home">
            <FaHome size={24} />
          </Link>
          <div className="w-px h-6 bg-border" />
          <Subscribe />
          <div className="w-px h-6 bg-border" />
          <Link href="https://github.com/ColtG-py/leet-code-explained" className="text-muted-foreground hover:text-foreground transition-colors" title="GitHub">
            <FaGithub size={24} />
          </Link>
          <Link href="https://ko-fi.com/coltgainey" className="text-muted-foreground hover:text-foreground transition-colors" title="Ko-fi">
            <FaCoffee size={24} />
          </Link>
        </div>
      </div>
    </header>
  )
}
