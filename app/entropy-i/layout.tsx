import { Syne } from "next/font/google"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

export default function EntropyILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={syne.variable}>{children}</div>
}
