'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ACTION_NOTIFICATIONS, type ActionNotif } from '@/lib/notifications-data'
import { getRequests, updateRequestStatus, formatWantDate, type WantRequest } from '@/lib/want-requests'
import { saveConversation } from '@/lib/messages-data'

const TABS = ['アクション通知', '足あと', 'お気に入り'] as const

type Footprint = {
  id: string
  username: string
  avatarGradient: { from: string; to: string }
  timestamp: string
  mutual?: boolean  // 自分からの場合: 相手も自分を見ているか
}

const FOOTPRINT_TABS = ['相手から', '自分から'] as const

type FavoriteUser = {
  id: string
  username: string
  avatarGradient: { from: string; to: string }
  height: number
  weight: number
  age: number
  timestamp: string
}

const FAVORITE_USERS: FavoriteUser[] = [
  { id: '1', username: '知也',   avatarGradient: { from: '#F4A261', to: '#E76F51' }, height: 175, weight: 65, age: 28, timestamp: '1時間前' },
  { id: '2', username: 'Kenji',  avatarGradient: { from: '#2A9D8F', to: '#264653' }, height: 170, weight: 60, age: 25, timestamp: '昨日' },
  { id: '3', username: 'Takashi', avatarGradient: { from: '#8338EC', to: '#3A0CA3' }, height: 178, weight: 70, age: 30, timestamp: '2日前' },
  { id: '4', username: 'Sho',    avatarGradient: { from: '#4CC9F0', to: '#4361EE' }, height: 168, weight: 58, age: 22, timestamp: '3日前' },
  { id: '5', username: 'Ryo',    avatarGradient: { from: '#F72585', to: '#7209B7' }, height: 172, weight: 63, age: 27, timestamp: '4日前' },
]

const FOOTPRINTS_FROM_OTHERS: Footprint[] = [
  { id: '1', username: 'Ryo', avatarGradient: { from: '#F4A261', to: '#E76F51' }, timestamp: '10分前' },
  { id: '2', username: 'Hiro', avatarGradient: { from: '#2A9D8F', to: '#264653' }, timestamp: '1時間前' },
  { id: '3', username: 'Sho', avatarGradient: { from: '#4CC9F0', to: '#4361EE' }, timestamp: '2時間前' },
  { id: '4', username: 'Yuki', avatarGradient: { from: '#F72585', to: '#7209B7' }, timestamp: '3時間前' },
  { id: '5', username: 'Ken', avatarGradient: { from: '#8338EC', to: '#3A0CA3' }, timestamp: '5時間前' },
  { id: '6', username: 'Daiki', avatarGradient: { from: '#F4A261', to: '#E76F51' }, timestamp: '昨日' },
  { id: '7', username: 'Masa', avatarGradient: { from: '#2A9D8F', to: '#264653' }, timestamp: '昨日' },
  { id: '8', username: 'Taro', avatarGradient: { from: '#4CC9F0', to: '#4361EE' }, timestamp: '2日前' },
  { id: '9', username: 'Jun', avatarGradient: { from: '#F72585', to: '#7209B7' }, timestamp: '2日前' },
  { id: '10', username: 'Shin', avatarGradient: { from: '#8338EC', to: '#3A0CA3' }, timestamp: '3日前' },
]

const FOOTPRINTS_FROM_ME: Footprint[] = [
  { id: '1', username: 'Kenji', avatarGradient: { from: '#2A9D8F', to: '#264653' }, timestamp: '20分前', mutual: true },
  { id: '2', username: 'Takashi', avatarGradient: { from: '#F72585', to: '#7209B7' }, timestamp: '1時間前', mutual: false },
  { id: '3', username: 'Ryota', avatarGradient: { from: '#8338EC', to: '#3A0CA3' }, timestamp: '2時間前', mutual: true },
  { id: '4', username: 'Naoto', avatarGradient: { from: '#4CC9F0', to: '#4361EE' }, timestamp: '4時間前', mutual: false },
  { id: '5', username: 'Kota', avatarGradient: { from: '#F4A261', to: '#E76F51' }, timestamp: '昨日', mutual: false },
  { id: '6', username: 'Shun', avatarGradient: { from: '#2A9D8F', to: '#264653' }, timestamp: '昨日', mutual: true },
  { id: '7', username: 'Ren', avatarGradient: { from: '#F72585', to: '#7209B7' }, timestamp: '2日前', mutual: false },
  { id: '8', username: 'Yuto', avatarGradient: { from: '#8338EC', to: '#3A0CA3' }, timestamp: '3日前', mutual: false },
]

function Avatar({
  gradient,
  locked = false,
}: {
  gradient: { from: string; to: string }
  locked?: boolean
}) {
  return (
    <div
      className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg"
      style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
    >
      {locked ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" fill="rgba(255,255,255,0.55)" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
          <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.7)" />
          <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="rgba(255,255,255,0.7)" />
        </svg>
      )}
    </div>
  )
}

function TypeBadge({ type }: { type: ActionNotif['type'] }) {
  if (type === 'message') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z" fill="currentColor" />
        </svg>
        メッセージ
      </span>
    )
  }
  if (type === 'favorite') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-500">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        お気に入り
      </span>
    )
  }
  if (type === 'review') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        レビュー
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      会いたい
    </span>
  )
}

function ActionNotificationItem({ notif, isVIP }: { notif: ActionNotif; isVIP: boolean }) {
  const router = useRouter()
  const locked = !isVIP && notif.type !== 'message' && notif.type !== 'review' && notif.username === null
  const displayName = isVIP ? notif.username : null

  const isReview = notif.type === 'review'

  function handleClick() {
    if (isReview) router.push('/users/1#reviews')
  }

  return (
    <div
      onClick={handleClick}
      className={`flex gap-3 mx-3 mt-2 rounded-xl px-4 py-4 shadow-sm ${
        !notif.isRead ? 'bg-sky-50' : 'bg-white'
      } ${isReview ? 'cursor-pointer active:opacity-90' : ''}`}
    >
      {/* 未読インジケーター */}
      <div className="flex w-2 flex-shrink-0 items-start pt-4">
        {!notif.isRead && (
          <div className={`h-2 w-2 rounded-full ${isReview ? 'bg-amber-400' : 'bg-sky-500'}`} />
        )}
      </div>

      {isReview ? (
        <div
          className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ) : (
        <Avatar gradient={notif.avatarGradient} locked={locked} />
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <TypeBadge type={notif.type} />
          <span className="ml-auto flex-shrink-0 text-[11px] text-gray-400">{notif.timestamp}</span>
        </div>

        {notif.type === 'message' ? (
          <p className="text-sm font-semibold text-gray-800">
            {notif.username}さんから新着メッセージが届いています
          </p>
        ) : isReview ? (
          <p className="text-sm font-semibold text-gray-800">新しいレビューが届きました</p>
        ) : (
          <>
            <p className="text-sm text-gray-700">
              {displayName ? (
                <span className="font-semibold text-gray-800">{displayName}</span>
              ) : (
                <span className="font-bold text-gray-400 tracking-widest">●●●</span>
              )}
              <span className="font-medium">
                {notif.type === 'favorite' ? 'さんにお気に入りされました' : 'さんに「会いたい」を送られました'}
              </span>
            </p>
            {!isVIP && (
              <button className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-sky-400 px-3 py-1 text-[11px] font-semibold text-sky-500 transition-colors active:bg-sky-50">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                サブスクに登録してユーザーを確認する
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FootprintItem({ fp, direction }: { fp: Footprint; direction: '相手から' | '自分から' }) {
  return (
    <div className="flex items-center gap-3 mx-3 mt-2 rounded-xl bg-white px-4 py-4 shadow-sm">
      <div className="flex w-2 flex-shrink-0" />
      <Avatar gradient={fp.avatarGradient} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-gray-800">{fp.username}さん</p>
          {direction === '自分から' && fp.mutual && (
            <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-600">
              相互
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {direction === '相手から'
            ? 'あなたのプロフィールを見ました'
            : 'プロフィールを見ました'}
        </p>
      </div>
      <span className="flex-shrink-0 text-[11px] text-gray-400">{fp.timestamp}</span>
    </div>
  )
}

export function NotificationsView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('アクション通知')
  const [footprintTab, setFootprintTab] = useState<typeof FOOTPRINT_TABS[number]>('相手から')
  const [pendingRequests, setPendingRequests] = useState<WantRequest[]>([])
  const [acceptedRequest, setAcceptedRequest] = useState<{ req: WantRequest; convId: string } | null>(null)

  const [isVIP, setIsVIP] = useState(false)

  useEffect(() => {
    setPendingRequests(getRequests().filter(r => r.status === 'pending'))
    setIsVIP(localStorage.getItem('unleash_vip') === 'true')
  }, [activeTab])

  function handleAccept(req: WantRequest) {
    updateRequestStatus(req.id, 'accepted')
    const convId = `want-${req.id}`
    saveConversation({
      id: convId,
      username: req.toUserName,
      height: 0, weight: 0, age: 0,
      hasPhoto: false,
      photoGradient: req.toUserGradient ?? { from: '#0EA5E9', to: '#2563EB' },
      lastMessage: `${formatWantDate(req.date, req.time)} ${req.place}`,
      timestamp: '今',
      unread: true,
      autoCreated: true,
    })
    setPendingRequests(prev => prev.filter(r => r.id !== req.id))
    setAcceptedRequest({ req, convId })
  }

  function handleReject(req: WantRequest) {
    updateRequestStatus(req.id, 'rejected')
    setPendingRequests(prev => prev.filter(r => r.id !== req.id))
  }

  const unreadCount = ACTION_NOTIFICATIONS.filter(n => !n.isRead).length + pendingRequests.length
  const currentFootprints = footprintTab === '相手から' ? FOOTPRINTS_FROM_OTHERS : FOOTPRINTS_FROM_ME

  return (
    <>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center px-4 pt-3 pb-2">
          <h1 className="text-base font-bold text-gray-800">通知</h1>
          {unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>

        {/* メインタブ */}
        <div className="flex border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-sky-500 text-sky-500'
                  : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 足あとサブタブ */}
        {activeTab === '足あと' && (
          <div className="flex gap-2 px-4 py-2.5">
            {FOOTPRINT_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setFootprintTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  footprintTab === tab
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* コンテンツ */}
      <main className="flex-1 bg-gray-100 pb-16">
        {activeTab === 'お気に入り' ? (
          <div>
            {FAVORITE_USERS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-semibold text-gray-500">お気に入りはありません</p>
              </div>
            ) : (
              FAVORITE_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="flex w-full items-center gap-3 mx-3 mt-2 w-[calc(100%-1.5rem)] rounded-xl bg-white px-4 py-4 shadow-sm active:opacity-90"
                >
                  <div
                    className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${user.avatarGradient.from}, ${user.avatarGradient.to})` }}
                  >
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                      <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.7)" />
                      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="rgba(255,255,255,0.7)" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-base font-bold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-400">{user.height}cm / {user.weight}kg / {user.age}歳</p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-[11px] text-gray-400">{user.timestamp}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : activeTab === 'アクション通知' ? (
          <div>
            {/* 会いたい受信（pending） */}
            {pendingRequests.map(req => (
              <div key={req.id} className="flex gap-3 mx-3 mt-2 rounded-xl bg-red-50 px-4 py-4 shadow-sm">
                <div className="flex w-2 flex-shrink-0 items-start pt-4">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                </div>
                <div
                  className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg"
                  style={{ background: req.toUserGradient ? `linear-gradient(135deg, ${req.toUserGradient.from}, ${req.toUserGradient.to})` : '#4ECDC4' }}
                >
                  {isVIP ? (
                    <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full p-2" fill="none">
                      <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.7)" />
                      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="rgba(255,255,255,0.7)" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="10" rx="2" fill="rgba(255,255,255,0.55)" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      会いたい
                    </span>
                  </div>
                  {isVIP ? (
                    <>
                      <p className="text-sm font-semibold text-gray-800">{req.toUserName}さんから届いています</p>
                      <p className="mt-0.5 text-xs font-semibold text-sky-600">
                        {formatWantDate(req.date, req.time)}{req.place}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleAccept(req)}
                          className="flex-1 rounded-full py-1.5 text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
                        >
                          承認
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          className="flex-1 rounded-full bg-gray-100 py-1.5 text-xs font-semibold text-gray-500"
                        >
                          却下
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-gray-400 tracking-widest">●●●</span>
                        <span className="font-medium">さんから届いています</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">日程・場所はVIPプランで確認できます</p>
                      <button className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-sky-400 px-3 py-1 text-[11px] font-semibold text-sky-500 transition-colors active:bg-sky-50">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        サブスクに登録してユーザーを確認する
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {ACTION_NOTIFICATIONS.map(notif => (
              <ActionNotificationItem key={notif.id} notif={notif} isVIP={isVIP} />
            ))}
          </div>
        ) : (
          <div>
            {currentFootprints.map(fp => (
              <FootprintItem key={fp.id} fp={fp} direction={footprintTab} />
            ))}
          </div>
        )}
      </main>
      {/* 予定確定ポップアップ */}
      {acceptedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#0EA5E9" />
                  <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-base font-bold text-gray-800">予定が確定しました！</h2>
            <p className="mt-1 text-center text-sm text-gray-500">{acceptedRequest.req.toUserName}さん</p>
            <p className="mt-1 text-center text-sm font-semibold text-sky-600">
              {formatWantDate(acceptedRequest.req.date, acceptedRequest.req.time)}{acceptedRequest.req.place}
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  router.push(`/messages/${acceptedRequest.convId}`)
                  setAcceptedRequest(null)
                }}
                className="w-full rounded-full py-2.5 text-sm font-bold text-white"
                style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
              >
                メッセージを見る
              </button>
              <button
                onClick={() => setAcceptedRequest(null)}
                className="w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
