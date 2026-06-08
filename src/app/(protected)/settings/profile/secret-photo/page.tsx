'use client'

import { useState, useRef } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function SecretPhotoPage() {
  const [hasPhoto, setHasPhoto] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSlotClick() {
    if (hasPhoto) return
    inputRef.current?.click()
  }

  function handleRemove() {
    setHasPhoto(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="シークレットフォト" backHref="/settings/profile" />

      <main className="p-4 space-y-4">
        {/* 説明 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" fill="rgba(255,255,255,0.7)" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-800">シークレットフォトとは</p>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            他のユーザーのプロフィールに鍵付きで表示される写真です。
            相手がタップすると「お互いに公開しますか？」のリクエストが届き、
            双方が承認するとお互いの写真が公開されます。
          </p>
        </div>

        {/* プレビュー説明 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold text-gray-500">相手のプロフィールには以下のように表示されます</p>
          <div className="flex items-center gap-3">
            <button className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-700 flex flex-col items-center justify-center gap-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" fill="rgba(255,255,255,0.55)" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-semibold text-white/60">シークレット</span>
            </button>
            <p className="text-xs leading-relaxed text-gray-400">
              タップすると相手に<br />公開リクエストが送られます
            </p>
          </div>
        </div>

        {/* アップロードスロット */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs text-gray-400">1枚まで登録できます</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => setHasPhoto(true)}
          />

          {hasPhoto ? (
            <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl bg-gray-200">
              {/* 登録済みプレースホルダー（実装時は実画像） */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #8338EC, #3A0CA3)' }}
              />
              <button
                onClick={handleRemove}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-2">
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white">
                  登録済み
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleSlotClick}
              className="relative flex aspect-square w-full max-w-[160px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white"
            >
              <div className="flex flex-col items-center gap-1.5 text-gray-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-xs">写真を追加</span>
              </div>
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">※ 写真アップロードは本実装時に有効になります</p>
      </main>
    </div>
  )
}
