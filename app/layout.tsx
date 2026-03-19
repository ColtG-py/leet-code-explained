import './globals.css'
import type { Metadata } from 'next'
import CapsuleHeader from './components/CapsuleHeader'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from './components/ThemeProvider'
import { monogram } from './fonts'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.explained.engineering'),
  title: {
    default: 'Software, explained.',
    template: '%s | Software, explained.',
  },
  description: 'Articles on software engineering with interactive 3D visuals. Clear explanations of algorithms, tools, and concepts.',
  openGraph: {
    title: 'Software, explained.',
    description: 'Articles on software engineering with interactive 3D visuals.',
    url: '/',
    siteName: 'Software, explained.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software, explained.',
    description: 'Articles on software engineering with interactive 3D visuals.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${monogram.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-[family-name:var(--font-monogram)]">
        <ThemeProvider defaultTheme="dark" attribute="class" enableSystem={false} forcedTheme="dark">
          <CapsuleHeader />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
