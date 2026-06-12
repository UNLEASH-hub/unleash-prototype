'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CONVERSATIONS, getExtraConversations, type Conversation } from '@/lib/messages-data'

function PersonPlaceholder() {
  return (
    <div className="absolute inset-0" style={{ background: '#4ECDC4' }}>
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <circle cx="40" cy="28" r="16" fill="rgba(255,255,255,0.45)" />
        <ellipse cx="40" cy="75" rx="26" ry="18" fill="rgba(255,255,255,0.45)" />
      </svg>
    </div>
  )
}

function ConvAvatar({ conv }: { conv: Conversation }) {
  if (conv.hasPhoto && conv.photoGradient) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${conv.photoGradient.from}, ${conv.photoGradient.to})` }}
      />
    )
  }
  if (conv.photoGradient) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${conv.photoGradient.from}, ${conv.photoGradient.to})` }}
      />
    )
  }
  return <PersonPlaceholder />
}

export function MessagesListView() {
  const [extraConvs, setExtraConvs] = useState<Conversation[]>([])

  useEffect(() => {
    setExtraConvs(getExtraConversations())
  }, [])

  const allConvs = [...extraConvs, ...CONVERSATIONS]

  return (
    <>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Image src="/icons/app_logo.png" alt="UNLEASH" width={36} height={36} className="rounded-lg" />
          <span className="text-xs text-gray-400">
            残り配信数：<span className="font-semibold text-gray-600">68通</span>
          </span>
        </div>
      </header>

      {/* 会話リスト */}
      <main className="flex-1 space-y-2 bg-gray-100 p-3 pb-16">
        {allConvs.map(conv => (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className="flex items-center gap-3 rounded-xl bg-white px-4 py-4 shadow-sm active:opacity-90"
          >
            {/* アバター */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <ConvAvatar conv={conv} />
            </div>

            {/* ユーザー情報 */}
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-gray-800">{conv.username}</p>
              {conv.autoCreated ? (
                <p className="mt-0.5 truncate text-xs text-sky-500">{conv.lastMessage}</p>
              ) : (
                <p className="text-xs text-gray-400">
                  {conv.height}cm / {conv.weight}kg / {conv.age}歳
                </p>
              )}
            </div>

            {/* 未読 + 時刻 */}
            <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${conv.unread ? 'bg-red-500' : ''}`} />
              <span className="text-[11px] text-gray-400">{conv.timestamp}</span>
            </div>
          </Link>
        ))}
      </main>
    </>
  )
}
