import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Frontier App',
  description: 'Strategic Business Planning Application',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
