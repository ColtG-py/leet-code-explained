import type { ComponentPropsWithoutRef } from 'react'

export default function MDXImage(props: ComponentPropsWithoutRef<'img'>) {
  const { src, alt, ...rest } = props

  if (!src) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      className="max-w-full rounded-lg my-6"
      loading="lazy"
      {...rest}
    />
  )
}
