import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Software, explained."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0a1a 0%, #1a1030 40%, #0d0d1a 100%)",
          position: "relative",
        }}
      >
        {/* Decorative circles to evoke 3D aesthetic */}
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #7c3aed 0%, #4c1d95 60%, transparent 100%)",
            top: "80px",
            left: "150px",
            opacity: 0.6,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #a78bfa 0%, #6d28d9 60%, transparent 100%)",
            top: "200px",
            right: "200px",
            opacity: 0.4,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #8b5cf6 0%, #5b21b6 60%, transparent 100%)",
            bottom: "150px",
            left: "400px",
            opacity: 0.5,
            display: "flex",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            color: "#e8e0f0",
            letterSpacing: "4px",
            display: "flex",
            zIndex: 10,
          }}
        >
          Software, explained.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#9585b0",
            marginTop: "20px",
            display: "flex",
            zIndex: 10,
          }}
        >
          Articles on a wide variety of engineering concepts, broken down with interactive 3D elements.
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "22px",
            color: "#6b5b80",
            display: "flex",
          }}
        >
          explained.engineering
        </div>
      </div>
    ),
    { ...size }
  )
}
