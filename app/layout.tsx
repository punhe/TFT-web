import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Email Marketing Tracker',
  description: 'Track email opens and clicks for CRM marketing campaigns',
  icons: {
    icon: '/assests/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}

