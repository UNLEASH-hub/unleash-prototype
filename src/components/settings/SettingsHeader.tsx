import Link from 'next/link'

export function SettingsHeader({ title, backHref }: { title: string; backHref: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
      <div className="flex items-center px-4 py-3.5">
        <Link href={backHref} className="mr-3 text-sky-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="text-base font-bold text-gray-800">{title}</span>
      </div>
    </header>
  )
}

export function NavRow({ href, label, danger }: { href: string; label: string; danger?: boolean }) {
  return (
    <Link href={href} className="flex items-center justify-between px-4 py-3.5 active:bg-gray-50">
      <span className={`text-sm font-medium ${danger ? 'text-gray-400' : 'text-gray-800'}`}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

export function SettingsGroup({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl bg-white shadow-sm">{children}</div>
}

export function Divider() {
  return <div className="mx-4 h-px bg-gray-100" />
}
