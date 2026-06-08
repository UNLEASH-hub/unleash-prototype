'use client'

import { useState, useEffect } from 'react'
import { SettingsHeader } from '@/components/settings/SettingsHeader'

type VerifyStatus = 'unverified' | 'pending' | 'verified'

const DOC_TYPES = ['運転免許証', 'マイナンバーカード', 'パスポート', '在留カード'] as const

export default function VerificationPage() {
  const [status, setStatus] = useState<VerifyStatus>('unverified')
  const [selectedDoc, setSelectedDoc] = useState<string>('')
  const [hasFile, setHasFile] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('unleash_verification') as VerifyStatus | null
    if (saved) setStatus(saved)
  }, [])

  function handleSubmit() {
    localStorage.setItem('unleash_verification', 'pending')
    setStatus('pending')
  }

  // 開発用：審査完了シミュレート
  function handleApprove() {
    localStorage.setItem('unleash_verification', 'verified')
    setStatus('verified')
  }

  if (status === 'verified') {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <SettingsHeader title="本人確認" backHref="/settings/account" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">認証済み</p>
            <p className="mt-1 text-sm text-gray-500">本人確認が完了しています</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-sky-50 px-4 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.09 4.26L19 7.27l-3.5 3.41.83 4.82L12 13.27l-4.33 2.23.83-4.82L5 7.27l4.91-1.01L12 2z" fill="#0EA5E9" />
            </svg>
            <span className="text-sm font-semibold text-sky-600">認証済みバッジが表示されています</span>
          </div>
        </main>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <SettingsHeader title="本人確認" backHref="/settings/account" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">審査中</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              書類を確認しています。<br />通常1〜2営業日で完了します。
            </p>
          </div>
          <div className="w-full rounded-2xl bg-amber-50 p-4">
            <p className="text-xs leading-relaxed text-amber-700">
              審査が完了するとプッシュ通知でお知らせします。それまでしばらくお待ちください。
            </p>
          </div>
          {/* 開発用ボタン */}
          <button
            onClick={handleApprove}
            className="mt-4 rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-400"
          >
            （開発用）審査完了にする
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="本人確認" backHref="/settings/account" />

      <main className="p-4 space-y-4 pb-8">
        {/* 説明 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.09 4.26L19 7.27l-3.5 3.41.83 4.82L12 13.27l-4.33 2.23.83-4.82L5 7.27l4.91-1.01L12 2z" fill="#0EA5E9" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-800">認証済みバッジを取得しよう</p>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-500">
            {[
              '本人確認が完了するとプロフィールに認証済みバッジが付きます',
              '他のユーザーから信頼されやすくなります',
              '提出した書類は審査後に削除されます',
            ].map(t => (
              <li key={t} className="flex items-start gap-1.5">
                <span className="mt-0.5 flex-shrink-0 text-sky-400">•</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 書類の種類 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
          <p className="text-sm font-bold text-gray-800">提出する書類を選択</p>
          <div className="grid grid-cols-2 gap-2">
            {DOC_TYPES.map(doc => (
              <button
                key={doc}
                onClick={() => setSelectedDoc(doc)}
                className={`rounded-xl border-2 py-3 text-xs font-semibold transition-colors ${
                  selectedDoc === doc
                    ? 'border-sky-500 bg-sky-50 text-sky-600'
                    : 'border-gray-100 bg-white text-gray-600'
                }`}
              >
                {doc}
              </button>
            ))}
          </div>
        </div>

        {/* 写真アップロード */}
        <div className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
          <p className="text-sm font-bold text-gray-800">書類の写真をアップロード</p>
          <p className="text-xs text-gray-400">文字がはっきり読み取れる写真を提出してください</p>
          <button
            onClick={() => setHasFile(true)}
            className={`relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 transition-colors ${
              hasFile ? 'border-sky-300 bg-sky-50' : 'border-gray-200 bg-white'
            }`}
          >
            {hasFile ? (
              <>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-semibold text-sky-500">写真が選択されました</span>
              </>
            ) : (
              <>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M17 8l-5-5-5 5M12 3v12" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-gray-400">タップして写真を選択</span>
              </>
            )}
          </button>
        </div>

        {/* 注意事項 */}
        <p className="text-xs leading-relaxed text-gray-400 px-1">
          提出された書類は本人確認の目的のみに使用し、審査完了後に安全に削除されます。
          個人情報の取り扱いについては
          <span className="text-sky-500">プライバシーポリシー</span>
          をご確認ください。
        </p>

        {/* 申請ボタン */}
        <button
          onClick={handleSubmit}
          disabled={!selectedDoc || !hasFile}
          className="w-full rounded-full py-3.5 text-sm font-bold text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
        >
          申請する
        </button>
      </main>
    </div>
  )
}
