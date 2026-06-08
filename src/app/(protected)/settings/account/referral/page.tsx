'use client'

import { useState } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

const MY_CODE = 'UNLEASH-A7K2'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(MY_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="友だち紹介コード" backHref="/settings/account" />
      <main className="p-4 space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
          <p className="mb-2 text-xs text-gray-400">あなたの紹介コード</p>
          <p className="text-2xl font-bold tracking-widest text-gray-800">{MY_CODE}</p>
          <button
            onClick={handleCopy}
            className="mt-4 w-full rounded-full py-2.5 text-sm font-bold text-white"
            style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
          >
            {copied ? 'コピーしました ✓' : 'コードをコピーする'}
          </button>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs leading-relaxed text-gray-500">
            友だちにコードをシェアしよう！友だちが登録すると、あなたにポイントが付与されます。
          </p>
        </div>
      </main>
    </div>
  )
}
