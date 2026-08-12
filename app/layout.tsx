import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Providers from './providers'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Colibris - Sustainable Waste Collections',
  description: 'Sustainable, eco-friendly waste collection and recycling services',
  openGraph: {
    title: 'Colibris - Sustainable Collections',
    description: 'Sustainable, eco-friendly waste collection and recycling services',
    siteName: 'Colibris',
  },
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased bg-surface text-on-surface`}>
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
