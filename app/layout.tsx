import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Pheezes — Gifts that elevate every moment.',
    template: '%s | Pheezes',
  },
  description:
    'Discover our curated collection of premium gifts crafted for every special occasion. Fast delivery across Bangladesh.',
  keywords: ['gifts', 'premium gifts', 'pheezes', 'gift shop', 'bangladesh', 'online gift store'],
  authors: [{ name: 'Pheezes' }],
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Pheezes',
    title: 'Pheezes — Gifts that elevate every moment.',
    description: 'Discover our curated collection of premium gifts crafted for every special occasion.',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Pheezes — Gifts that elevate every moment.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pheezes — Gifts that elevate every moment.',
    description: 'Discover our curated collection of premium gifts crafted for every special occasion.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
