import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Punhe CRM',
  description: 'Email marketing tracker - Track email opens and clicks for CRM marketing campaigns',
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
        <Providers>
          <Header />
          <main className="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

