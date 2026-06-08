'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SettingsGroup, Divider, NavRow } from './SettingsHeader'

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${enabled ? 'bg-sky-500' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

const VIP_BENEFITS = [
  'お気に入りしたユーザーが分かる',
  '足あとを無制限で閲覧',
  'メッセージ配信数UP',
]

export function SettingsView() {
  const router = useRouter()
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [isVIP, setIsVIP] = useState(false)
  const [showNotifInfo, setShowNotifInfo] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('notif_enabled')
    if (saved !== null) setNotifEnabled(saved === 'true')
    setIsVIP(localStorage.getItem('unleash_vip') === 'true')
  }, [])

  function toggleVIPDev() {
    const next = !isVIP
    setIsVIP(next)
    localStorage.setItem('unleash_vip', String(next))
  }

  function handleToggleNotif() {
    const next = !notifEnabled
    setNotifEnabled(next)
    localStorage.setItem('notif_enabled', String(next))
    if (next) setShowNotifInfo(true)
  }

  function handleLogout() {
    router.push('/start')
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="px-4 py-3.5">
          <h1 className="text-base font-bold text-gray-800">設定</h1>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 pb-20">

        {/* VIP カード（加入状態で切り替え） */}
        {isVIP ? (
          /* ── 加入中ステータスカード ── */
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
          >
            {/* ヘッダー行 */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/icons/app_logo.png" alt="VIP" width={28} height={28} className="rounded-lg" />
                <span className="text-sm font-bold text-white">UNLEASH VIP</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-white">加入中</span>
              </div>
            </div>

            {/* 有効期限 */}
            <p className="mb-3 text-xs text-amber-100">2026年6月30日 まで有効</p>

            {/* 特典リスト */}
            <ul className="mb-4 space-y-1">
              {VIP_BENEFITS.map(b => (
                <li key={b} className="flex items-center gap-1.5 text-[11px] text-amber-100">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            {/* 自動更新ラベル */}
            <button disabled className="w-full rounded-full bg-white/30 py-2.5 text-sm font-bold text-white/80">
              自動更新中
            </button>

            {/* 開発用トグル */}
            <button onClick={toggleVIPDev} className="mt-2 w-full text-center text-[10px] text-amber-200/70">
              （開発用）VIPを解除する
            </button>
          </div>
        ) : (
          /* ── 未加入 CTA カード ── */
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #2563EB)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Image src="/icons/app_logo.png" alt="VIP" width={28} height={28} className="rounded-lg" />
              <span className="text-sm font-bold text-white">UNLEASH VIP</span>
            </div>
            <p className="mb-2 text-xs font-semibold text-sky-100">プレミアム機能をすべて解放</p>
            <ul className="mb-4 space-y-1">
              {VIP_BENEFITS.map(b => (
                <li key={b} className="flex items-center gap-1.5 text-[11px] text-sky-100">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <button onClick={toggleVIPDev} className="w-full rounded-full bg-white py-2.5 text-sm font-bold text-sky-600">
              VIPパスに登録する
            </button>
          </div>
        )}

        {/* プロフィール / アカウント */}
        <SettingsGroup>
          <NavRow href="/settings/profile" label="プロフィール設定" />
          <Divider />
          <NavRow href="/settings/account" label="アカウント設定" />
        </SettingsGroup>

        {/* 通知設定 */}
        <SettingsGroup>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm font-medium text-gray-800">通知設定</span>
            <Toggle enabled={notifEnabled} onToggle={handleToggleNotif} />
          </div>
        </SettingsGroup>

        {/* サポート */}
        <SettingsGroup>
          <NavRow href="/settings/support" label="サポート" />
        </SettingsGroup>

        {/* ログアウト */}
        <SettingsGroup>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3.5"
          >
            <span className="text-sm font-medium text-red-500">ログアウト</span>
          </button>
        </SettingsGroup>

      </main>

      {/* 通知ONポップアップ */}
      {showNotifInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-center text-base font-bold text-gray-800">通知を受け取るには</h2>
            <p className="mb-5 text-center text-xs leading-relaxed text-gray-500">
              プッシュ通知を受け取るには、このアプリをホーム画面に追加する必要があります。{'\n'}
              ブラウザの「共有」→「ホーム画面に追加」から設定してください。
            </p>
            <button
              onClick={() => setShowNotifInfo(false)}
              className="w-full rounded-full py-3 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
            >
              わかった
            </button>
          </div>
        </div>
      )}
    </>
  )
}
