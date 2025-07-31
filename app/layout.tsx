
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Frontier App',
  description: 'Strategic Business Planning Application',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Frontier App</title>
        <meta name="description" content="Strategic Business Planning Application" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
