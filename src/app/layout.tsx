import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mosque Finder',
  description: 'Find nearby mosques in your area',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}