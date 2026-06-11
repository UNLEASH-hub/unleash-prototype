import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UNLEASH',
  description: 'Meet nearby.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        {/* デスクトップでもスマホサイズ(390px)で中央固定 */}
        <div className="mx-auto min-h-screen w-full max-w-[390px] bg-white shadow-xl">
          {children}
        </div>
      </body>
    </html>
  )
}
