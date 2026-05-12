import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Providers } from './providers'
import { WalletBadge } from './_components/WalletBadge'

export const metadata: Metadata = {
  title: 'My NFT dApp',
  description: 'ERC-721 표준 기능 테스트',
}

const TABS: { href: string; label: string }[] = [
  { href: '/dapp/gallery', label: '갤러리' },
  { href: '/dapp/lookup', label: '조회' },
  { href: '/dapp/mint', label: '민팅' },
  { href: '/dapp/approve', label: '승인' },
  { href: '/dapp/transfer', label: '전송' },
  { href: '/dapp/interfaces', label: '인터페이스' },
]

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-white text-zinc-900">
        <Providers>
          <header className="max-w-6xl mx-auto p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-2xl font-bold">My NFT dApp</h1>
                <p className="text-sm text-zinc-500">ERC-721 표준 기능 테스트</p>
              </div>
              <Link href="/" className="text-sm underline text-zinc-500">
                홈으로
              </Link>
            </div>
            <nav className="mt-3 flex gap-2 flex-wrap">
              {TABS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="px-3 py-1 rounded-full border text-sm hover:bg-zinc-50"
                >
                  {t.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4">
              <WalletBadge />
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-6 pb-12">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
