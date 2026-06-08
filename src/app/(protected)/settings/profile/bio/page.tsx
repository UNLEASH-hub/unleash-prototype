'use client'

import { useState, useEffect } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

const MAX = 300

export default function BioSettingsPage() {
  const [bio,   setBio]   = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('profile_bio')
    if (raw) setBio(raw)
  }, [])

  function handleSave() {
    localStorage.setItem('profile_bio', bio)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="自己紹介文" backHref="/settings/profile" />
      <main className="p-4 space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, MAX))}
            placeholder="自己紹介を入力してください"
            rows={8}
            className="w-full resize-none px-4 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-300"
          />
          <div className="border-t border-gray-100 px-4 py-2 text-right text-xs text-gray-400">
            {bio.length} / {MAX}
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full rounded-full py-3 text-sm font-bold text-white"
          style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
        >
          {saved ? '保存しました ✓' : '保存する'}
        </button>
      </main>
    </div>
  )
}
