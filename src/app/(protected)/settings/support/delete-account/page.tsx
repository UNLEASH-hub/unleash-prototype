'use client'

import { useState } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function DeleteAccountPage() {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="退会" backHref="/settings/support" />

      <main className="flex-1 p-4 space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#EF4444" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-800">退会の前にご確認ください</p>
          </div>
          <ul className="space-y-2 text-sm text-gray-500">
            {[
              'プロフィール・写真・メッセージなど、すべてのデータが削除されます',
              'VIPパスの残り期間は返金されません',
              '一度退会すると元に戻すことはできません',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0 text-red-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="w-full rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-400"
        >
          退会する
        </button>
      </main>

      {/* 確認モーダル */}
      {showConfirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowConfirm(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-center text-base font-bold text-gray-800">本当に退会しますか？</h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
              この操作は取り消せません。すべてのデータが完全に削除されます。
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <button className="w-full rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">
                退会する
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
