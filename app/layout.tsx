import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SQL Learning App',
  description: 'Practice SQL queries safely with an interactive SQL editor. Learn SELECT, JOIN, aggregations, and more!',
  icons: {
    icon: '/assests/favicon.ico',
  },
  keywords: ['SQL', 'learning', 'database', 'queries', 'PostgreSQL', 'tutorial'],
  authors: [{ name: 'SQL Learning App' }],
  openGraph: {
    title: 'SQL Learning App',
    description: 'Practice SQL queries safely with an interactive SQL editor',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {/* Floating gradient orbs */}
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />

          <Header />
          <main className="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
