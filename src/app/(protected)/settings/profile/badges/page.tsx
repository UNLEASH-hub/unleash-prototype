'use client'

import { useState, useEffect } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'
import { BADGE_CATEGORIES } from '@/lib/badges-data'

const FREE_LABELS = new Set(['セクシャル', 'ポジション', '目的'])

export default function BadgesSettingsPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [saved,    setSaved]    = useState(false)
  const [isVIP,    setIsVIP]    = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('profile_tags')
    if (raw) setSelected(JSON.parse(raw))
    setIsVIP(localStorage.getItem('unleash_vip') === 'true')
  }, [])

  const maxSelect = isVIP ? 20 : 3
  const visibleCategories = isVIP
    ? BADGE_CATEGORIES
    : BADGE_CATEGORIES.filter(c => FREE_LABELS.has(c.label))

  function toggle(tag: string) {
    setSelected(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : prev.length < maxSelect ? [...prev, tag] : prev
    )
  }

  function handleSave() {
    localStorage.setItem('profile_tags', JSON.stringify(selected))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="バッジ設定" backHref="/settings/profile" />
      <main className="p-4 pb-8 space-y-6">
        <p className="text-xs text-gray-400">最大 {maxSelect} 個まで選択できます（{selected.length}/{maxSelect}）</p>

        {visibleCategories.map(category => (
          <div key={category.label}>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider">{category.label}</h3>
              {category.premium && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(to right, #F59E0B, #D97706)' }}>
                  プレミアム
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {category.tags.map(tag => {
                const active = selected.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {!isVIP && (
          <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}>
            <p className="text-xs font-bold text-amber-700">プレミアムバッジはVIPプランで解放</p>
            <p className="mt-1 text-[11px] text-amber-600">募集内容・好み・プレイなど6カテゴリー＋最大20個まで設定可能</p>
          </div>
        )}

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
