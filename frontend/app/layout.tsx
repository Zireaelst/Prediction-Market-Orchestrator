import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prediction Market Orchestrator',
  description: 'Decentralized Prediction Market with AI Analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
