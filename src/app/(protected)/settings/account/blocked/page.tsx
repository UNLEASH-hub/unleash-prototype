import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function BlockedListPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="ブロックリスト" backHref="/settings/account" />
      <main className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.8" />
            <path d="M4.93 4.93l14.14 14.14" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-500">ブロックしているユーザーはいません</p>
      </main>
    </div>
  )
}
