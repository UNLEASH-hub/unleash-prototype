'use client'

import { useState } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function EmailSettingsPage() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  function handleSend() {
    if (!email) return
    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="アドレス変更" backHref="/settings/account" />
      <main className="p-4 space-y-4">
        {sent ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-700">確認メールを送信しました</p>
            <p className="mt-1 text-xs text-gray-400">メール内のリンクからアドレス変更を完了してください。</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="px-4 py-3.5">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">新しいメールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="new@example.com"
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!email}
              className="w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
            >
              確認メールを送信する
            </button>
          </>
        )}
      </main>
    </div>
  )
}
