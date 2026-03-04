import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { Providers } from './providers'
import {
  WebsiteJsonLd,
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  FAQJsonLd,
} from '@/components/JsonLd'

const BASE_URL = 'https://punhelabs.io.vn'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  // ===== BASIC METADATA =====
  title: {
    default: 'PunheLabs - Nền tảng học SQL tương tác miễn phí | Punhe',
    template: '%s | PunheLabs by Punhe',
  },
  description:
    'PunheLabs (PunheLab) by Punhe - Nền tảng học SQL tương tác miễn phí. Thực hành truy vấn SQL trực tiếp trên trình duyệt với SELECT, JOIN, GROUP BY và nhiều hơn nữa. Không cần cài đặt, bắt đầu học ngay!',

  // ===== KEYWORDS (targeting "punhe" and "punhelab") =====
  keywords: [
    'punhe',
    'punhelab',
    'punhelabs',
    'punhe labs',
    'punhe lab',
    'PunheLabs',
    'PunheLab',
    'Punhe',
    'học SQL',
    'học SQL online',
    'SQL editor online',
    'thực hành SQL',
    'SQL learning',
    'SQL tutorial',
    'truy vấn SQL',
    'PostgreSQL',
    'database learning',
    'học cơ sở dữ liệu',
    'SQL miễn phí',
    'punhelabs.io.vn',
    'interactive SQL',
    'SQL practice',
    'learn SQL vietnamese',
  ],

  // ===== AUTHORS & CREATOR =====
  authors: [
    { name: 'Punhe', url: BASE_URL },
    { name: 'PunheLabs', url: BASE_URL },
  ],
  creator: 'Punhe',
  publisher: 'PunheLabs',

  // ===== CANONICAL & ALTERNATE =====
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/',
      'en-US': '/',
    },
  },

  // ===== ICONS =====
  icons: {
    icon: '/assests/favicon.ico',
    shortcut: '/assests/favicon.ico',
    apple: '/assests/favicon.ico',
  },

  // ===== OPEN GRAPH (Facebook, LinkedIn, etc.) =====
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: BASE_URL,
    siteName: 'PunheLabs',
    title: 'PunheLabs - Nền tảng học SQL tương tác miễn phí | by Punhe',
    description:
      'PunheLabs by Punhe - Học SQL miễn phí với trình soạn thảo tương tác trực tuyến. Thực hành SELECT, JOIN, GROUP BY và nhiều câu lệnh SQL khác ngay trên trình duyệt.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PunheLabs - Interactive SQL Learning Platform by Punhe',
        type: 'image/png',
      },
    ],
  },

  // ===== TWITTER CARD =====
  twitter: {
    card: 'summary_large_image',
    title: 'PunheLabs - Học SQL tương tác miễn phí | Punhe',
    description:
      'Thực hành SQL trực tiếp trên trình duyệt với PunheLabs. Nền tảng học SQL tương tác miễn phí do Punhe phát triển.',
    images: ['/og-image.png'],
    creator: '@punhe',
    site: '@punhelabs',
  },

  // ===== ROBOTS =====
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ===== VERIFICATION (Add your verification codes here) =====
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },

  // ===== APP LINKS =====
  appLinks: {
    web: {
      url: BASE_URL,
      should_fallback: true,
    },
  },

  // ===== CATEGORY =====
  category: 'education',

  // ===== OTHER META TAGS =====
  other: {
    'google-site-verification': '', // Fill in after registering with Google Search Console
    'msvalidate.01': '', // Fill in after registering with Bing Webmaster Tools
    'og:locale:alternate': 'en_US',
    'revisit-after': '3 days',
    'rating': 'General',
    'geo.region': 'VN',
    'geo.placename': 'Vietnam',
    'DC.title': 'PunheLabs - Nền tảng học SQL tương tác | Punhe',
    'DC.creator': 'Punhe',
    'DC.subject': 'SQL Learning, Database Education',
    'DC.description': 'PunheLabs by Punhe - Interactive SQL Learning Platform',
    'DC.publisher': 'PunheLabs',
    'DC.language': 'vi',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="light">
      <head>
        {/* Preconnect to important origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD Structured Data for SEO */}
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
        <FAQJsonLd />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {/* Floating gradient orbs */}
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />

          <Header />
          <main className="main-content">
            {children}
          </main>

          {/* SEO Footer - Hidden but crawlable content */}
          <footer className="sr-only" aria-hidden="false">
            <p>
              PunheLabs (PunheLab) - Nền tảng học SQL tương tác miễn phí do Punhe phát triển.
              Truy cập punhelabs.io.vn để bắt đầu học SQL online ngay hôm nay.
              Punhe | PunheLab | PunheLabs - Interactive SQL Learning Platform.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
