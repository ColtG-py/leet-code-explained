import localFont from "next/font/local"

export const monogram = localFont({
  src: [
    {
      path: "../fonts/ttf/monogram-extended.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ttf/monogram-extended-italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-monogram",
  display: "swap",
})
