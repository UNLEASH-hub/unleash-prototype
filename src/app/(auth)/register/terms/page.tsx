'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GradientButton } from '@/components/onboarding/GradientButton'

export default function TermsPage() {
  const router = useRouter()
  const [checkedAge, setCheckedAge] = useState(false)
  const [checkedTerms, setCheckedTerms] = useState(false)

  const canProceed = checkedAge && checkedTerms

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 上部画像エリア */}
      <div className="h-[45vh] bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
        <span className="text-white/50 text-6xl font-black select-none">UNLEASH</span>
      </div>

      {/* 下部コンテンツ */}
      <div className="flex flex-1 flex-col px-6 pb-10 pt-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          利用規約およびプライバシーポリシーを読み内容にご同意いただけた方のみアプリをご利用いただけます。
        </p>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          また、18歳未満のご利用はできません。18歳未満と発覚した場合は即座にアカウントが停止されます。
        </p>

        <div className="mt-3 flex gap-4 text-sm">
          <Link href="#" className="text-sky-500 hover:underline">利用規約</Link>
          <Link href="#" className="text-sky-500 hover:underline">プライバシーポリシー</Link>
        </div>

        <div className="mt-6 space-y-4 flex-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedAge}
              onChange={e => setCheckedAge(e.target.checked)}
              className="h-5 w-5 rounded accent-sky-500"
            />
            <span className="text-sm text-gray-700">私は18歳以上です</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedTerms}
              onChange={e => setCheckedTerms(e.target.checked)}
              className="h-5 w-5 rounded accent-sky-500"
            />
            <span className="text-sm text-gray-700">上記内容のすべてに同意します</span>
          </label>
        </div>

        <GradientButton
          onClick={() => router.push('/register/language')}
          disabled={!canProceed}
        >
          内容に同意して進む
        </GradientButton>
      </div>
    </div>
  )
}
