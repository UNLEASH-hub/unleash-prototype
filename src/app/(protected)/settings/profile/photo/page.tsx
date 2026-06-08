'use client'

import { SettingsHeader } from '@/components/settings/SettingsHeader'

const SLOTS = [0, 1, 2, 3]

export default function PhotoSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="写真" backHref="/settings/profile" />
      <main className="p-4">
        <p className="mb-4 text-xs text-gray-400">最大4枚まで登録できます。最初の1枚がメイン写真になります。</p>
        <div className="grid grid-cols-2 gap-3">
          {SLOTS.map(i => (
            <button
              key={i}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white"
            >
              <div className="flex flex-col items-center gap-1 text-gray-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xs">{i === 0 ? 'メイン写真' : `写真 ${i + 1}`}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">※ 写真アップロードは本実装時に有効になります</p>
      </main>
    </div>
  )
}
