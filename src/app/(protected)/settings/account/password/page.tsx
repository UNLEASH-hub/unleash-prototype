'use client'

import { useState } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function PasswordSettingsPage() {
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [saved,    setSaved]    = useState(false)

  const isValid = current && next && next === confirm && next.length >= 8

  function handleSave() {
    if (!isValid) return
    setSaved(true)
  }

  const fields = [
    { label: '現在のパスワード', value: current, set: setCurrent },
    { label: '新しいパスワード（8文字以上）', value: next, set: setNext },
    { label: '新しいパスワード（確認）', value: confirm, set: setConfirm },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="パスワード変更" backHref="/settings/account" />
      <main className="p-4 space-y-4">
        {saved ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-700">パスワードを変更しました</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {fields.map(({ label, value, set }, i) => (
                <div key={label}>
                  <div className="px-4 py-3.5">
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">{label}</label>
                    <input
                      type="password"
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-300"
                    />
                  </div>
                  {i < fields.length - 1 && <div className="mx-4 h-px bg-gray-100" />}
                </div>
              ))}
            </div>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
            >
              変更する
            </button>
          </>
        )}
      </main>
    </div>
  )
}
