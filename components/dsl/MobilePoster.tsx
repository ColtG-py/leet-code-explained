interface MobilePosterProps {
  src: string
  alt?: string
}

export default function MobilePoster({ src, alt = "" }: MobilePosterProps) {
  return (
    <div className="w-full h-screen sticky top-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
