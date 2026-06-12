'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { UserCard, TodayUserRow, NearbyUserRow, type DummyUser } from './UserCard'
import { UsersHeader, type TabType } from './UsersHeader'
import { LocationPickerModal } from './LocationPickerModal'
import { haversineKm, formatDistance } from '@/utils/distance'
import { saveRequest, formatWantDate, todayDateStr } from '@/lib/want-requests'

const THRESHOLD = 80
const MAX_PULL = 120

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Phase = 'idle' | 'pulling' | 'locating' | 'refreshing'

export function UsersClientWrapper({ initialUsers }: { initialUsers: DummyUser[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [pullY, setPullY] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [activeTab, setActiveTab] = useState<TabType>('付近を検索')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<Set<string>>(new Set())
  const [wantedIds, setWantedIds] = useState<Set<string>>(new Set())
  const [pendingWantId, setPendingWantId] = useState<string | null>(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null)

  function handleTabChange(tab: TabType) {
    setActiveTab(tab)
    if (tab !== 'バッジ検索') {
      setSelectedTags(new Set())
      setActiveFilter(new Set())
    }
  }

  function handleTagToggle(tag: string) {
    if (tag === '__reset__') { setSelectedTags(new Set()); return }
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) { next.delete(tag) } else { next.add(tag) }
      return next
    })
  }

  function handleFilter() {
    setActiveFilter(new Set(selectedTags))
    scrollRef.current?.scrollTo({ top: 0 })
  }

  const usersWithDistance = searchCenter
    ? users.map(u => ({ ...u, _km: haversineKm(searchCenter.lat, searchCenter.lng, u.lat, u.lng) }))
    : null

  const visibleUsers = activeTab === '今日会える'
    ? users.filter(u => u.scheduleToday)
    : searchCenter && usersWithDistance
      ? usersWithDistance
          .filter(u => u._km <= 5)
          .sort((a, b) => a._km - b._km)
          .map(u => ({ ...u, distance: formatDistance(u._km) }))
      : activeFilter.size > 0
        ? users.filter(u => Array.from(activeFilter).every(tag => u.tags.includes(tag)))
        : users

  const scrollRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const touchActiveRef = useRef(false)
  const mouseActiveRef = useRef(false)
  const pullYRef = useRef(0)

  const completeRefresh = useCallback(() => {
    setPhase('refreshing')
    setTimeout(() => {
      setUsers(u => shuffle(u))
      setPullY(0)
      setPhase('idle')
    }, 600)
  }, [])

  const triggerRefresh = useCallback(() => {
    setPhase('locating')
    navigator.geolocation.getCurrentPosition(
      () => completeRefresh(),
      () => completeRefresh(),
      { timeout: 5000 }
    )
  }, [completeRefresh])

  // passive:false touchmove to allow preventDefault (blocks native scroll bounce)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onTouchMove = (e: TouchEvent) => {
      if (!touchActiveRef.current) return
      if (el.scrollTop !== 0) { touchActiveRef.current = false; return }
      const dy = e.touches[0].clientY - startYRef.current
      if (dy <= 0) { touchActiveRef.current = false; return }
      e.preventDefault()
      const clamped = Math.min(dy, MAX_PULL)
      pullYRef.current = clamped
      setPullY(clamped)
      setPhase('pulling')
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [])

  function onTouchStart(e: React.TouchEvent) {
    if (scrollRef.current?.scrollTop !== 0) return
    startYRef.current = e.touches[0].clientY
    touchActiveRef.current = true
    pullYRef.current = 0
  }

  function onTouchEnd() {
    if (!touchActiveRef.current) return
    touchActiveRef.current = false
    if (pullYRef.current >= THRESHOLD) {
      triggerRefresh()
    } else {
      setPullY(0)
      setPhase('idle')
    }
  }

  function onMouseDown(e: React.MouseEvent) {
    if (scrollRef.current?.scrollTop !== 0) return
    startYRef.current = e.clientY
    mouseActiveRef.current = true
    pullYRef.current = 0
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!mouseActiveRef.current) return
    if (scrollRef.current?.scrollTop !== 0) { mouseActiveRef.current = false; return }
    const dy = e.clientY - startYRef.current
    if (dy <= 0) return
    const clamped = Math.min(dy, MAX_PULL)
    pullYRef.current = clamped
    setPullY(clamped)
    setPhase('pulling')
  }

  function onMouseRelease() {
    if (!mouseActiveRef.current) return
    mouseActiveRef.current = false
    if (pullYRef.current >= THRESHOLD) {
      triggerRefresh()
    } else {
      setPullY(0)
      setPhase('idle')
    }
  }

  const indicatorH = phase === 'idle' ? pullY : Math.max(pullY, 48)
  const progress = Math.min(pullY / THRESHOLD, 1)
  const isRefreshing = phase === 'locating' || phase === 'refreshing'

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white">
      <UsersHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onFilter={handleFilter}
        onRefresh={triggerRefresh}
        isRefreshing={isRefreshing}
        onOpenMap={() => setShowMapModal(true)}
        searchLabel={searchCenter ? '選択地点から検索中' : undefined}
      />

      {/* PTRインジケーター */}
      <div
        className="flex flex-shrink-0 items-center justify-center overflow-hidden"
        style={{
          height: indicatorH,
          transition: phase === 'idle' ? 'height 0.25s ease' : 'none',
        }}
      >
        {phase === 'locating' ? (
          <p className="text-xs text-gray-500">現在地を取得中...</p>
        ) : (
          <svg
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            className={phase === 'refreshing' ? 'animate-spin' : ''}
            style={{ transform: phase === 'pulling' ? `rotate(${progress * 360}deg)` : undefined }}
          >
            <path
              d="M21 12a9 9 0 1 1-6.219-8.56"
              stroke={progress >= 1 ? '#0EA5E9' : '#9CA3AF'}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* スクロールエリア */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-scroll pb-16"
        style={{ overscrollBehavior: 'none' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseRelease}
        onMouseLeave={onMouseRelease}
      >
        {visibleUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="1.8" />
                <path d="M16.5 16.5L21 21" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            {activeTab === '今日会える' ? (
              <>
                <p className="text-sm font-semibold text-gray-500">今日の募集がありません</p>
                <p className="mt-1 text-xs text-gray-400">また後で確認してみてください</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-500">該当するユーザーがいません</p>
                <p className="mt-1 text-xs text-gray-400">タグの組み合わせを変えてみてください</p>
              </>
            )}
          </div>
        ) : activeTab === '今日会える' ? (
          <div className="divide-y divide-gray-100">
            {visibleUsers.map(u => (
              <TodayUserRow
                key={u.id}
                user={u}
                isWanted={wantedIds.has(u.id)}
                onWantPress={() => setPendingWantId(u.id)}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visibleUsers.map(u => (
              <NearbyUserRow key={u.id} user={u} />
            ))}
          </div>
        )}

        {/* 会いたい確認モーダル */}
        {pendingWantId !== null && (() => {
          const target = users.find(u => u.id === pendingWantId)
          if (!target) return null
          const today = todayDateStr()
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
              <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-center text-base font-bold text-gray-800">会いたいを送信しますか？</h2>
                <p className="mt-1 text-center text-sm text-gray-500">{target.name}さんに送ります</p>
                {target.scheduleToday && (
                  <p className="mt-2 text-center text-sm font-semibold text-sky-600">
                    {formatWantDate(today, target.scheduleToday.time)}{target.scheduleToday.place}
                  </p>
                )}
                <div className="mt-5 flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      if (target.scheduleToday) {
                        saveRequest({
                          toUserId: pendingWantId,
                          toUserName: target.name,
                          toUserHasPhoto: target.hasPhoto,
                          toUserGradient: target.photoGradient,
                          date: today,
                          time: target.scheduleToday.time,
                          place: target.scheduleToday.place,
                        })
                      }
                      setWantedIds(prev => { const next = new Set(prev); next.add(pendingWantId); return next })
                      setPendingWantId(null)
                    }}
                    className="w-full rounded-full py-2.5 text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(to right, #F87171, #EF4444)' }}
                  >
                    送る
                  </button>
                  <button
                    onClick={() => setPendingWantId(null)}
                    className="w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {showMapModal && (
        <LocationPickerModal
          onConfirm={(lat, lng) => {
            setSearchCenter({ lat, lng })
            setShowMapModal(false)
            scrollRef.current?.scrollTo({ top: 0 })
          }}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  )
}
