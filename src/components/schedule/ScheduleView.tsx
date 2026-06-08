'use client'

import { useState, useEffect } from 'react'

type Schedule = {
  id: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  place: string
  purpose: string
}

const PLACE_OPTIONS = [
  '自宅',
  'ホテル',
  '現地集合',
  'クルージングスポット',
  'バー',
  'クラブ',
  'ジム',
  'その他',
]

const STORAGE_KEY = 'unleash_schedules'

const INITIAL_SCHEDULES: Schedule[] = [
  { id: '1', date: '2026-05-22', time: '14:00', place: 'ホテル',   purpose: 'デートしたい' },
  { id: '2', date: '2026-05-25', time: '18:00', place: 'バー',     purpose: '一緒に飲みたい' },
  { id: '3', date: '2026-06-01', time: '10:00', place: 'ジム',     purpose: 'トレーニング仲間募集' },
]

function toDateStr(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function getTodayStr() {
  return toDateStr(new Date())
}

function getWeekendDateStr() {
  const d = new Date()
  const day = d.getDay() // 0=日, 6=土
  if (day === 0 || day === 6) return toDateStr(d)
  d.setDate(d.getDate() + (6 - day)) // 次の土曜
  return toDateStr(d)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日（${dow}）`
}

const EMPTY_FORM = { date: '', time: '', place: '', purpose: '' }

export function ScheduleView() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const today = getTodayStr()
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed: Schedule[] = JSON.parse(saved)
      setSchedules(parsed.filter(s => s.date >= today))
    } else {
      setSchedules(INITIAL_SCHEDULES.filter(s => s.date >= today))
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules))
  }, [schedules, loaded])

  function handleAdd() {
    if (!form.date || !form.time || !form.place || !form.purpose) return
    const entry: Schedule = { id: String(Date.now()), ...form }
    setSchedules(prev =>
      [...prev, entry].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    )
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setSchedules(prev => prev.filter(s => s.id !== id))
  }

  function closeModal() {
    setShowModal(false)
    setForm(EMPTY_FORM)
  }

  function quickAdd(type: 'tonight' | 'weekend') {
    const date = type === 'tonight' ? getTodayStr() : getWeekendDateStr()
    const entry: Schedule = {
      id: String(Date.now()),
      date,
      time: type === 'tonight' ? '20:00' : '14:00',
      place: '現地集合',
      purpose: type === 'tonight' ? '今夜空いてます' : '今週末空いてます',
    }
    setSchedules(prev =>
      [...prev, entry].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    )
  }

  const today = getTodayStr()
  const isValid = Boolean(form.date && form.time && form.place && form.purpose)

  return (
    <>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-base font-bold text-gray-800">空き日程</h1>
            <p className="text-[11px] text-gray-400">プロフィールに表示される空き日程</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #2563EB)' }}
            aria-label="スケジュールを追加"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* スケジュール一覧 */}
      <main className="flex-1 pb-16 px-4 py-4">
        {/* ワンタップ追加 */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => quickAdd('tonight')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold text-white shadow-sm active:opacity-80"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z" />
            </svg>
            今夜空いてる
          </button>
          <button
            onClick={() => quickAdd('weekend')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold text-white shadow-sm active:opacity-80"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #2563EB)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="17" rx="2" fill="none" stroke="white" strokeWidth="2" />
              <path d="M3 9h18M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            今週末空いてる
          </button>
        </div>

        {!loaded ? null : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="#9CA3AF" strokeWidth="1.8" />
                <path d="M3 9h18M8 2v4M16 2v4" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-500">空き日程がありません</p>
            <p className="mt-1 text-xs text-gray-400">右上の ＋ から追加してください</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map(s => (
              <div key={s.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <p className="text-base font-bold text-gray-800">{formatDate(s.date)}</p>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-300 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

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
            ))}
          </div>
        )}
      </main>

      {/* 追加モーダル */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={closeModal} />
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 rounded-t-3xl bg-white pt-4" style={{ maxHeight: '90dvh' }}>
            {/* ドラッグハンドル */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

            <div className="mb-5 flex items-center justify-between px-6">
              <h2 className="text-base font-bold text-gray-800">スケジュールを追加</h2>
              <button onClick={closeModal} className="text-gray-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 pb-10 space-y-4" style={{ maxHeight: 'calc(90dvh - 80px)' }}>
              {/* 日程 */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">日程</label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-sky-400"
                />
              </div>

              {/* 時間 */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">時間</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-sky-400"
                />
              </div>

              {/* 場所 */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-500">場所</label>
                <div className="flex flex-wrap gap-2">
                  {PLACE_OPTIONS.map(p => (
                    <button
                      key={p}
                      onClick={() => setForm(f => ({ ...f, place: p }))}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        form.place === p
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 目的 */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">目的</label>
                <input
                  type="text"
                  value={form.purpose}
                  onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                  placeholder="例：一緒に飲みたい、デートしたい"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-300 focus:border-sky-400"
                />
              </div>

              {/* 追加ボタン */}
              <button
                onClick={handleAdd}
                disabled={!isValid}
                className="mt-1 w-full rounded-full py-3 text-sm font-bold text-white transition-opacity disabled:opacity-40"
                style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
              >
                スケジュールを追加する
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
