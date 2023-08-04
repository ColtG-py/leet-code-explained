import './globals.css'
import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import MyProfilePic from './components/MyProfilePic'
import Banner from './components/Banner'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Software - Explained',
  description: 'Generated by a person.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-800">
        <Navbar />
        <MyProfilePic />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
