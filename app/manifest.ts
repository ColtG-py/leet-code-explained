import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Software, explained.',
    short_name: 'SE',
    description: 'Articles on software engineering with interactive 3D visuals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0a1a',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
