'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { saveRequest, formatWantDate } from '@/lib/want-requests'

export type Schedule = {
  id: string
  date: string
  time: string
  place: string
  purpose: string
}

export type Profile = {
  id: string
  name: string
  height: number
  weight: number
  age: number
  rating: number
  hasPhoto: boolean
  photoCount?: number          // 公開写真の枚数（1〜4）
  photoGradient?: { from: string; to: string }
  tags: string[]
  bio: string
  schedules: Schedule[]
  isVerified?: boolean
}

// ─── helpers ────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日（${dow}）`
}

function getTodayStr() {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}

// ─── sub components ──────────────────────────────────────────

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = i <= Math.floor(rating)
        const half = !filled && i === Math.ceil(rating) && rating % 1 > 0
        return (
          <svg key={i} width="15" height="15" viewBox="0 0 24 24">
            {half && (
              <defs>
                <clipPath id={`cl-${i}`}>
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              </defs>
            )}
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? '#F59E0B' : '#E5E7EB'}
            />
            {half && (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#F59E0B"
                clipPath={`url(#cl-${i})`}
              />
            )}
          </svg>
        )
      })}
    </div>
  )
}

function SectionCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-bold text-sky-500">{label}</p>
      {children}
    </div>
  )
}

// ─── Profile card (写真 + 名前 + スタッツ + サムネイル) ────────

function getPhotoSrc(profile: Profile, photoNum: number): string | null {
  if (!profile.hasPhoto) return null
  const count = profile.photoCount ?? 1
  if (photoNum > count) return null
  return photoNum === 1
    ? `/images/users/${profile.id}.jpg`
    : `/images/users/${profile.id}_${photoNum}.jpg`
}

function PhotoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <img
        src={src}
        alt=""
        className="max-h-[85vh] max-w-full rounded-xl object-contain"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

function ProfileCard({ profile, onSecretPhotoTap }: { profile: Profile; onSecretPhotoTap: () => void }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const gradientStyle = profile.photoGradient
    ? { background: `linear-gradient(135deg, ${profile.photoGradient.from}, ${profile.photoGradient.to})` }
    : undefined

  const mainSrc = getPhotoSrc(profile, 1)

  return (
    <>
      <SectionCard label="Profile">
        <div className="flex gap-3">
          {/* メイン写真（写真1） */}
          <button
            className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl active:opacity-90"
            onClick={() => mainSrc && setLightboxSrc(mainSrc)}
          >
            {mainSrc
              ? <img src={mainSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
              : gradientStyle
                ? <div className="absolute inset-0" style={gradientStyle} />
                : <PersonPlaceholder />}
          </button>

          {/* 名前・スタッツ・評価 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
              {profile.isVerified && (
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sky-500">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {profile.height}cm / {profile.weight}kg / {profile.age}歳
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-lg font-bold text-gray-800">{profile.rating.toFixed(1)}</span>
              <StarRating rating={profile.rating} />
            </div>
          </div>
        </div>

        {/* サブ写真3枚（写真2・3・4）+ シークレット */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[2, 3, 4].map(num => {
            const src = getPhotoSrc(profile, num)
            return (
              <button
                key={num}
                className="relative aspect-square overflow-hidden rounded-lg active:opacity-80"
                onClick={() => src && setLightboxSrc(src)}
              >
                {src
                  ? <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  : <PersonPlaceholder />}
              </button>
            )
          })}

          {/* シークレット */}
          <button
            onClick={onSecretPhotoTap}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gray-700 active:bg-gray-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" fill="rgba(255,255,255,0.55)" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-semibold text-white/60">シークレット</span>
            </div>
          </button>
        </div>
      </SectionCard>

      {lightboxSrc && (
        <PhotoLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  )
}

// ─── タグ ──────────────────────────────────────────────────

function TagsSection({ tags }: { tags: string[] }) {
  return (
    <SectionCard label="パーソナルバッジ">
      {tags.length === 0 ? (
        <p className="text-sm text-gray-400">タグはありません</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
              {tag}
            </span>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

// ─── 会いたいボタン ───────────────────────────────────────────

function WantButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex flex-shrink-0 flex-col items-center gap-0.5"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#EF4444' : 'none'}>
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          stroke={active ? '#EF4444' : '#D1D5DB'}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`text-[9px] font-semibold leading-none ${active ? 'text-red-400' : 'text-gray-400'}`}>
        会いたい
      </span>
    </button>
  )
}

// ─── 空き日程（プレビュー） ────────────────────────────────

function SchedulePreview({
  schedules,
  wantedIds,
  onToggleWant,
  onViewAll,
}: {
  schedules: Schedule[]
  wantedIds: Set<string>
  onToggleWant: (id: string) => void
  onViewAll: () => void
}) {
  const today = getTodayStr()
  const upcoming = schedules.filter(s => s.date >= today)
  const preview = upcoming.slice(0, 3)

  return (
    <SectionCard label="空き日程">
      {preview.length === 0 ? (
        <p className="text-sm text-gray-400">空き日程はありません</p>
      ) : (
        <div className="space-y-2.5">
          {preview.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-gray-700">{formatDate(s.date)}</span>
                <span className="ml-2 text-xs text-gray-400">{s.time}〜</span>
                <span className="ml-1 text-xs text-gray-500">{s.place}</span>
              </div>
              <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                {s.purpose}
              </span>
              <WantButton active={wantedIds.has(s.id)} onToggle={() => onToggleWant(s.id)} />
            </div>
          ))}

          {upcoming.length > 3 && (
            <button
              onClick={onViewAll}
              className="mt-0.5 flex items-center gap-0.5 text-xs font-semibold text-sky-500"
            >
              すべて見る
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </SectionCard>
  )
}

// ─── 自己紹介 ────────────────────────────────────────────────

function BioSection({ bio }: { bio: string }) {
  return (
    <SectionCard label="自己紹介">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{bio}</p>
    </SectionCard>
  )
}

// ─── レビュー ────────────────────────────────────────────────

type Review = {
  id: string
  text: string
  height: number
  weight: number
  age: number
}

const REVIEW_OPTIONS = [
  'プロフィール通りだった',
  '時間通りに来た',
  '会話が楽しかった',
  'また会いたい',
  'イケメンだった',
  '可愛かった',
  '上手だった',
  '最高だった！',
]

// プロトタイプ用：レビュワー自身のダミースタッツ
const MY_STATS = { height: 175, weight: 65, age: 28 }

const SAMPLE_REVIEWS: Record<string, Review[]> = {
  '1': [
    { id: 's1', text: 'また会いたい',         height: 170, weight: 60, age: 25 },
    { id: 's2', text: 'プロフィール通りだった', height: 178, weight: 72, age: 31 },
    { id: 's3', text: 'イケメンだった',         height: 168, weight: 58, age: 24 },
  ],
  '2': [
    { id: 's1', text: '会話が楽しかった',       height: 175, weight: 65, age: 28 },
    { id: 's2', text: '時間通りに来た',         height: 172, weight: 63, age: 27 },
  ],
  '3': [
    { id: 's1', text: '最高だった！',           height: 168, weight: 58, age: 22 },
    { id: 's2', text: 'また会いたい',           height: 170, weight: 60, age: 25 },
    { id: 's3', text: '上手だった',             height: 175, weight: 65, age: 28 },
  ],
  '4': [
    { id: 's1', text: 'プロフィール通りだった', height: 180, weight: 75, age: 33 },
    { id: 's2', text: '可愛かった',             height: 172, weight: 63, age: 27 },
  ],
  '5': [
    { id: 's1', text: 'イケメンだった',         height: 178, weight: 72, age: 31 },
    { id: 's2', text: '会話が楽しかった',       height: 168, weight: 58, age: 24 },
    { id: 's3', text: '最高だった！',           height: 170, weight: 60, age: 25 },
  ],
  '6': [
    { id: 's1', text: '時間通りに来た',         height: 175, weight: 65, age: 28 },
    { id: 's2', text: 'また会いたい',           height: 168, weight: 58, age: 22 },
  ],
}

function getReviews(profileId: string): Review[] {
  const sample = SAMPLE_REVIEWS[profileId] ?? []
  if (typeof window === 'undefined') return sample
  try {
    const stored: Review[] = JSON.parse(localStorage.getItem(`reviews_${profileId}`) ?? '[]')
    return [...sample, ...stored]
  } catch { return sample }
}

function saveReview(profileId: string, review: Review) {
  const existing = getReviews(profileId)
  localStorage.setItem(`reviews_${profileId}`, JSON.stringify([...existing, review]))
  const reviewed: string[] = JSON.parse(localStorage.getItem('reviewed_profiles') ?? '[]')
  localStorage.setItem('reviewed_profiles', JSON.stringify([...reviewed, profileId]))
}

function hasReviewed(profileId: string): boolean {
  if (typeof window === 'undefined') return false
  try { return (JSON.parse(localStorage.getItem('reviewed_profiles') ?? '[]') as string[]).includes(profileId) } catch { return false }
}

function ReviewsSection({ profileId }: { profileId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isVIP, setIsVIP] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showVIPPrompt, setShowVIPPrompt] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setReviews(getReviews(profileId))
    setIsVIP(localStorage.getItem('unleash_vip') === 'true')
    setAlreadyReviewed(hasReviewed(profileId))
  }, [profileId])

  function handleAddClick() {
    if (!isVIP) { setShowVIPPrompt(true); return }
    setShowModal(true)
  }

  function handleSubmit() {
    if (!selected) return
    const review: Review = {
      id: Date.now().toString(),
      text: selected,
      ...MY_STATS,
    }
    saveReview(profileId, review)
    setReviews(prev => [...prev, review])
    setAlreadyReviewed(true)
    setSelected(null)
    setShowModal(false)
  }

  return (
    <>
      <SectionCard label="レビュー">
        {/* 閲覧エリア：非VIPはブラー＋ロックオーバーレイ */}
        <div className="relative">
          <div className={!isVIP && reviews.length > 0 ? 'pointer-events-none select-none blur-sm' : ''}>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">まだレビューはありません</p>
            ) : (
              <div className="space-y-2">
                {reviews.map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                    <span className="text-sm font-semibold text-gray-800">{r.text}</span>
                    <span className="flex-shrink-0 text-xs text-gray-400">{r.height}cm / {r.weight}kg / {r.age}歳</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {!isVIP && reviews.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#6B7280" strokeWidth="1.8" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <p className="text-xs font-semibold text-gray-500">VIPプランで閲覧できます</p>
            </div>
          )}
        </div>

        {alreadyReviewed ? (
          <p className="mt-3 text-xs text-gray-400">レビュー済みです</p>
        ) : (
          <button
            onClick={handleAddClick}
            className="mt-3 flex items-center gap-1.5 rounded-full border border-sky-400 px-3 py-1.5 text-xs font-semibold text-sky-500 active:bg-sky-50"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            レビューを追加
          </button>
        )}
      </SectionCard>

      {/* VIP誘導ポップアップ */}
      {showVIPPrompt && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowVIPPrompt(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" fill="#F59E0B" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800">VIPプランが必要です</h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              レビューの投稿・閲覧はVIPプランに加入しているユーザーのみご利用いただけます。
            </p>
            <button
              onClick={() => setShowVIPPrompt(false)}
              className="mt-4 w-full rounded-full py-2.5 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(to right, #F59E0B, #D97706)' }}
            >
              VIPプランを見る
            </button>
            <button
              onClick={() => setShowVIPPrompt(false)}
              className="mt-2 w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600"
            >
              閉じる
            </button>
          </div>
        </>
      )}

      {/* レビュー選択モーダル（VIPのみ） */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => { setShowModal(false); setSelected(null) }} />
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 rounded-t-2xl bg-white pb-10 pt-2 shadow-xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
            <p className="mb-3 px-5 text-sm font-bold text-gray-800">レビューを選択</p>
            <div className="space-y-1 px-4">
              {REVIEW_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelected(opt === selected ? null : opt)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    selected === opt
                      ? 'border-sky-400 bg-sky-50 text-sky-700'
                      : 'border-gray-100 text-gray-700'
                  }`}
                >
                  <span>{opt}</span>
                  {selected === opt && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4 px-4">
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
              >
                追加する
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// ─── スケジュールタブ（全件） ────────────────────────────────

function FullScheduleTab({
  schedules,
  wantedIds,
  onToggleWant,
}: {
  schedules: Schedule[]
  wantedIds: Set<string>
  onToggleWant: (id: string) => void
}) {
  const today = getTodayStr()
  const upcoming = schedules.filter(s => s.date >= today)

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="2" stroke="#9CA3AF" strokeWidth="1.8" />
            <path d="M3 9h18M8 2v4M16 2v4" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">空き日程はありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {upcoming.map(s => (
        <div key={s.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-gray-800">{formatDate(s.date)}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {s.time}〜
                </span>
                <span className="flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {s.place}
                </span>
              </div>
              <div className="mt-2.5">
                <span className="inline-block rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-semibold text-sky-700">
                  {s.purpose}
                </span>
              </div>
            </div>
            <WantButton active={wantedIds.has(s.id)} onToggle={() => onToggleWant(s.id)} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── 通報・ブロック定数 ───────────────────────────────────────

const REPORT_REASONS = [
  'スパム・宣伝',
  '不適切な写真・内容',
  '嫌がらせ・ハラスメント',
  '偽アカウント・なりすまし',
  '出会い目的以外の勧誘',
  'その他',
]

const BLOCK_REASONS = [
  '不快なメッセージが届いた',
  '知り合いに見られたくない',
  '不審なアカウント',
  '過去にトラブルがあった',
  'その他',
]

// ─── メイン export ────────────────────────────────────────────

export function ProfileView({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState<'プロフィール' | 'スケジュール'>('プロフィール')
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFavoriteToast, setShowFavoriteToast] = useState(false)
  const [wantedIds, setWantedIds] = useState<Set<string>>(new Set())
  const [pendingWantId, setPendingWantId] = useState<string | null>(null)
  const [showSecretModal, setShowSecretModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionModal, setActionModal] = useState<null | 'report' | 'block'>(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [otherText, setOtherText] = useState('')
  const [doneType, setDoneType] = useState<null | 'reported' | 'blocked'>(null)

  function openAction(type: 'report' | 'block') {
    setMenuOpen(false)
    setSelectedReason('')
    setOtherText('')
    setActionModal(type)
  }

  function handleConfirm() {
    setActionModal(null)
    setDoneType(actionModal === 'report' ? 'reported' : 'blocked')
  }

  const reasons = actionModal === 'report' ? REPORT_REASONS : BLOCK_REASONS
  const canConfirm = selectedReason !== '' && (selectedReason !== 'その他' || otherText.trim() !== '')

  function handleWantPress(id: string) {
    if (wantedIds.has(id)) {
      // 送信済みは確認なしで取り消し
      setWantedIds(prev => { const next = new Set(prev); next.delete(id); return next })
    } else {
      setPendingWantId(id)
    }
  }

  function confirmWant() {
    if (!pendingWantId) return
    const schedule = profile.schedules.find(s => s.id === pendingWantId)
    if (schedule) {
      saveRequest({
        toUserId: profile.id,
        toUserName: profile.name,
        toUserHasPhoto: profile.hasPhoto,
        toUserGradient: profile.photoGradient,
        date: schedule.date,
        time: schedule.time,
        place: schedule.place,
      })
    }
    setWantedIds(prev => new Set(prev).add(pendingWantId))
    setPendingWantId(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ヘッダー + タブ（sticky まとめて） */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between px-4 py-3.5">
          <Link href="/users" className="p-1 text-sky-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="text-base font-bold text-gray-800">{profile.name}</span>
          <button onClick={() => setMenuOpen(true)} className="p-1 text-sky-500">
            <svg width="22" height="6" viewBox="0 0 22 6" fill="currentColor">
              <circle cx="3" cy="3" r="2.5" />
              <circle cx="11" cy="3" r="2.5" />
              <circle cx="19" cy="3" r="2.5" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {(['プロフィール', 'スケジュール'] as const).map(tab => (
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
      </header>

      {/* コンテンツ */}
      <main className="flex-1 space-y-3 p-4 pb-24">
        {activeTab === 'プロフィール' ? (
          <>
            <ProfileCard profile={profile} onSecretPhotoTap={() => setShowSecretModal(true)} />
            <TagsSection tags={profile.tags} />
            <SchedulePreview
              schedules={profile.schedules}
              wantedIds={wantedIds}
              onToggleWant={handleWantPress}
              onViewAll={() => setActiveTab('スケジュール')}
            />
            <BioSection bio={profile.bio} />
            <ReviewsSection profileId={profile.id} />
          </>
        ) : (
          <FullScheduleTab schedules={profile.schedules} wantedIds={wantedIds} onToggleWant={handleWantPress} />
        )}
      </main>

      {/* ボトムシートメニュー（点々） */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 rounded-t-2xl bg-white pb-10 pt-2 shadow-xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />
            <button
              onClick={() => openAction('report')}
              className="flex w-full items-center gap-3 px-6 py-4 text-left active:bg-gray-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#6B7280" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M4 22v-7" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-medium text-gray-700">通報する</span>
            </button>
            <div className="mx-6 h-px bg-gray-100" />
            <button
              onClick={() => openAction('block')}
              className="flex w-full items-center gap-3 px-6 py-4 text-left active:bg-gray-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.8" />
                <path d="M4.93 4.93l14.14 14.14" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-medium text-red-500">ブロックする</span>
            </button>
            <div className="mx-4 mt-2 h-px bg-gray-200" />
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full py-4 text-sm font-semibold text-gray-500 active:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </>
      )}

      {/* 通報・ブロック理由選択モーダル */}
      {actionModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setActionModal(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
            {/* ヘッダー */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-bold text-gray-800">
                {actionModal === 'report' ? `${profile.name}さんを通報` : `${profile.name}さんをブロック`}
              </h3>
              <button onClick={() => setActionModal(null)} className="text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 理由リスト */}
            <div className="max-h-[55vh] overflow-y-auto px-5 py-3">
              <p className="mb-3 text-xs text-gray-500">理由を選択してください</p>
              <div className="space-y-2">
                {reasons.map(r => (
                  <button
                    key={r}
                    onClick={() => { setSelectedReason(r); if (r !== 'その他') setOtherText('') }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selectedReason === r
                        ? 'border-sky-400 bg-sky-50 text-sky-700'
                        : 'border-gray-100 bg-white text-gray-700'
                    }`}
                  >
                    <span>{r}</span>
                    {selectedReason === r && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* その他テキスト入力 */}
              {selectedReason === 'その他' && (
                <textarea
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  placeholder="詳しい理由を入力してください"
                  rows={3}
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-sky-400 focus:bg-white"
                />
              )}

              {/* 確認ボタン */}
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`mt-4 w-full rounded-full py-3 text-sm font-bold text-white transition-opacity disabled:opacity-40 ${
                  actionModal === 'block' ? 'bg-red-500' : ''
                }`}
                style={actionModal === 'report' ? { background: 'linear-gradient(to right, #0EA5E9, #2563EB)' } : {}}
              >
                {actionModal === 'report' ? '通報する' : 'ブロックする'}
              </button>
              <div className="h-4" />
            </div>
          </div>
        </>
      )}

      {/* 完了モーダル */}
      {doneType && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" />
          <div className="fixed left-1/2 top-1/2 z-50 w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-800">
              {doneType === 'reported' ? '通報しました' : 'ブロックしました'}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
              {doneType === 'reported'
                ? 'ご報告ありがとうございます。内容を確認し、適切な対応をいたします。'
                : `${profile.name}さんをブロックしました。このユーザーはあなたのプロフィールを閲覧できなくなります。`}
            </p>
            <button
              onClick={() => setDoneType(null)}
              className="mt-4 w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600"
            >
              閉じる
            </button>
          </div>
        </>
      )}

      {/* シークレットフォト公開モーダル */}
      {showSecretModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowSecretModal(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" fill="rgba(255,255,255,0.7)" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h3 className="text-center text-base font-bold text-gray-800">
              お互いにシークレットフォトを<br />公開しますか？
            </h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
              リクエストを送ると、{profile.name}さんが承認した場合にお互いの写真が公開されます。
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                onClick={() => setShowSecretModal(false)}
                className="w-full rounded-full py-2.5 text-sm font-bold text-white"
                style={{ background: 'linear-gradient(to right, #374151, #111827)' }}
              >
                公開リクエストを送る
              </button>
              <button
                onClick={() => setShowSecretModal(false)}
                className="w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        </>
      )}

      {/* 会いたい確認モーダル */}
      {pendingWantId && (() => {
        const schedule = profile.schedules.find(s => s.id === pendingWantId)
        return (
          <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setPendingWantId(null)} />
            <div className="fixed left-1/2 top-1/2 z-50 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-center text-base font-bold text-gray-800">会いたいを送信しますか？</h3>
              <p className="mt-1 text-center text-sm text-gray-500">{profile.name}さんに送ります</p>
              {schedule && (
                <p className="mt-2 text-center text-sm font-semibold text-sky-600">
                  {formatWantDate(schedule.date, schedule.time)}{schedule.place}
                </p>
              )}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  onClick={confirmWant}
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
          </>
        )
      })()}

      {/* お気に入りトースト */}
      {showFavoriteToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
          お気に入りしました！
        </div>
      )}

      {/* アクションバー */}
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[390px] -translate-x-1/2 flex items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
        <Link
          href={`/messages/${profile.id}`}
          className="flex flex-1 items-center justify-center rounded-full py-3 text-sm font-bold text-white"
          style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
        >
          メッセージを送る
        </Link>
        <button
          onClick={() => {
            const next = !isFavorite
            setIsFavorite(next)
            if (next) {
              setShowFavoriteToast(true)
              setTimeout(() => setShowFavoriteToast(false), 2000)
            }
          }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors"
          style={{ background: isFavorite ? '#F59E0B' : '#E5E7EB' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isFavorite ? 'white' : '#9CA3AF'}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
