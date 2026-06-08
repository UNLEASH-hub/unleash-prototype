'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { hasUnreadMessages } from '@/lib/messages-data'
import { hasUnreadNotifications } from '@/lib/notifications-data'

const NAV_ITEMS = [
  {
    href: '/notifications',
    label: '通知',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/messages',
    label: 'メッセージ',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/users',
    label: '探す',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3.5" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" />
        <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="8" r="2.5" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.6" />
        <path d="M14 19c0-2.21 1.343-4 3-4s3 1.79 3 4" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/schedule',
    label: 'カレンダー',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" />
        <path d="M3 9h18M8 2v4M16 2v4" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: '設定',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={active ? '#0EA5E9' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[390px] -translate-x-1/2 items-center justify-around border-t border-gray-100 bg-white px-2 pb-2 pt-2">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-2 py-1"
          >
            <div className="relative">
              {icon(active)}
              {href === '/messages' && hasUnreadMessages && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
              {href === '/notifications' && hasUnreadNotifications && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </div>
            <span className={`text-[10px] ${active ? 'text-sky-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
