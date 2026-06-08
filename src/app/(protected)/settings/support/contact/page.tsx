'use client'

import { useState } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

const CATEGORIES = ['不具合・エラー', '課金・サブスク', 'アカウント', 'その他']

export default function ContactPage() {
  const [category, setCategory] = useState('')
  const [message,  setMessage]  = useState('')
  const [sent,     setSent]     = useState(false)

  const isValid = category && message.trim().length >= 10

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="お問い合わせ" backHref="/settings/support" />
      <main className="p-4 space-y-4">
        {sent ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-700">お問い合わせを受け付けました</p>
            <p className="mt-1 text-xs text-gray-400">3営業日以内にご返信いたします。</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="px-4 py-3.5">
                <label className="mb-2 block text-xs font-semibold text-gray-500">カテゴリ</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        category === c ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mx-4 h-px bg-gray-100" />
              <div className="px-4 py-3.5">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  お問い合わせ内容（10文字以上）
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="具体的な内容をご記入ください"
                  rows={6}
                  className="w-full resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
            <button
              onClick={() => setSent(true)}
              disabled={!isValid}
              className="w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
            >
              送信する
            </button>
          </>
        )}
      </main>
    </div>
  )
}
