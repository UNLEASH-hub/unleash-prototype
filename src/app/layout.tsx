import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '500', '700', '900'] })

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
      <body className={`${notoSansJP.className} antialiased`}>
        {/* デスクトップでもスマホサイズ(390px)で中央固定 */}
        <div className="mx-auto min-h-screen w-full max-w-[390px] bg-white shadow-xl">
          {children}
        </div>
      </body>
    </html>
  )
}
