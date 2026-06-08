'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

type Message = {
  id: string
  text: string
  isMine: boolean
  timestamp: string
  dateLabel?: string
}

const MESSAGES_BY_ID: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'こんにちは！\n良ければ仲良くしてください！',
      isMine: false,
      timestamp: '07:12',
      dateLabel: '2025/05/01',
    },
    {
      id: '2',
      text: 'こんにちは！\nこちらこそよろしくお願いします！',
      isMine: true,
      timestamp: '07:32',
    },
    {
      id: '3',
      text: '何募集ですか？',
      isMine: false,
      timestamp: '13:46',
    },
    {
      id: '4',
      text: 'どうなんですかね〜笑\n今のところ色々募集って感じです！\nそちらは何募集ですか？',
      isMine: true,
      timestamp: '09:03',
      dateLabel: '2025/05/02',
    },
    {
      id: '5',
      text: '返信遅れてすみません💧\n自分は友達からセフレまで幅広くですね〜！',
      isMine: false,
      timestamp: '21:32',
    },
  ],
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-px flex-1 bg-gray-300" />
      <span className="text-[11px] text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  )
}

function MessageLines({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

type Props = {
  conversationId: string
  username: string
  avatarGradient?: { from: string; to: string }
}

export function ChatView({ conversationId, username, avatarGradient }: Props) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(
    MESSAGES_BY_ID[conversationId] ?? [
      { id: '1', text: 'こんにちは！', isMine: false, timestamp: '12:00' },
    ]
  )
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [])

  function handleSend() {
    if (!input.trim()) return
    const now = new Date()
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages(prev => [
      ...prev,
      { id: String(Date.now()), text: input.trim(), isMine: true, timestamp: ts },
    ])
    setInput('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const avatarStyle = avatarGradient
    ? { background: `linear-gradient(135deg, ${avatarGradient.from}, ${avatarGradient.to})` }
    : { background: '#4ECDC4' }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* ヘッダー */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <Link href="/messages" className="p-1 text-sky-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="text-base font-bold text-gray-800">{username}</span>
        <button className="p-1 text-sky-500">
          <svg width="22" height="6" viewBox="0 0 22 6" fill="currentColor">
            <circle cx="3" cy="3" r="2.5" />
            <circle cx="11" cy="3" r="2.5" />
            <circle cx="19" cy="3" r="2.5" />
          </svg>
        </button>
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.dateLabel && <DateSeparator label={msg.dateLabel} />}

            {msg.isMine ? (
              /* 送信済み (右寄せ) */
              <div className="mb-4 flex flex-col items-end">
                <div className="flex items-end gap-1.5">
                  <button className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-500 self-end">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 2l6 6M8 2l-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div
                    className="max-w-[220px] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #0EA5E9, #2563EB)' }}
                  >
                    <MessageLines text={msg.text} />
                  </div>
                </div>
                <span className="mt-1 text-[10px] text-gray-400">{msg.timestamp}</span>
              </div>
            ) : (
              /* 受信 (左寄せ) */
              <div className="mb-4 flex items-end gap-2">
                <Link href={`/users/${conversationId}`} className="h-8 w-8 flex-shrink-0 rounded-full" style={avatarStyle} />
                <div>
                  <div className="max-w-[220px] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm">
                    <MessageLines text={msg.text} />
                  </div>
                  <span className="mt-1 block text-[10px] text-gray-400">{msg.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 入力バー */}
      <div className="flex flex-shrink-0 items-center gap-2 border-t border-gray-200 bg-white px-3 py-2.5">
        <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 active:bg-gray-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="メッセージを入力"
          className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors"
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #0EA5E9, #2563EB)' : '#E5E7EB',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
              stroke={input.trim() ? 'white' : '#9CA3AF'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
