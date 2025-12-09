import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Email Marketing Tracker',
  description: 'Track email opens and clicks for CRM marketing campaigns',
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

