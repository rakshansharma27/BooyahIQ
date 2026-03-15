import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'BooyahIQ - Win Smarter. Play Harder.',
  description: 'Free Fire gaming intelligence platform. Track stats, manage guilds, dominate tournaments.',
  keywords: ['Free Fire', 'gaming', 'esports', 'guild', 'stats', 'tournament'],
  openGraph: {
    title: 'BooyahIQ',
    description: 'Win Smarter. Play Harder.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080a0f] text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
