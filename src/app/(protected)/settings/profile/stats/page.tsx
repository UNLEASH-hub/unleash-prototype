'use client'

import { useState, useEffect } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function StatsSettingsPage() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age,    setAge]    = useState('')
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('profile_stats')
    if (raw) {
      const d = JSON.parse(raw)
      setHeight(d.height ?? '')
      setWeight(d.weight ?? '')
      setAge(d.age ?? '')
    }
  }, [])

  function handleSave() {
    localStorage.setItem('profile_stats', JSON.stringify({ height, weight, age }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="身長・体重・年齢" backHref="/settings/profile" />
      <main className="p-4 space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {[
            { label: '身長', unit: 'cm', value: height, set: setHeight },
            { label: '体重', unit: 'kg', value: weight, set: setWeight },
            { label: '年齢', unit: '歳', value: age,    set: setAge },
          ].map(({ label, unit, value, set }, i, arr) => (
            <div key={label}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="w-16 text-sm font-medium text-gray-700">{label}</span>
                <input
                  type="number"
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder="--"
                  className="flex-1 bg-transparent text-right text-sm text-gray-800 outline-none"
                />
                <span className="text-sm text-gray-400">{unit}</span>
              </div>
              {i < arr.length - 1 && <div className="mx-4 h-px bg-gray-100" />}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-full py-3 text-sm font-bold text-white transition-opacity"
          style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
        >
          {saved ? '保存しました ✓' : '保存する'}
        </button>
      </main>
    </div>
  )
}
