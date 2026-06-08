'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ダミー: 6桁ならOK
    if (code.length === 6) {
      router.push('/register/terms')
    } else {
      setError('6桁のコードを入力してください')
    }
  }

  return (
    <OnboardingLayout title={'認証コードを\n入力してください'} backHref="/register">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex-1">
          <div className="border-b border-gray-300 py-3">
            <input
              type="number"
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              placeholder="123456"
              maxLength={6}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          <p className="mt-3 text-xs text-gray-400">
            届いたSMSに記載されている6桁の数字を入力してください。
          </p>
          {/* ダミーのヒント */}
          <p className="mt-1 text-xs text-sky-400">
            ※ デモ: 任意の6桁を入力してください
          </p>
          <button type="button" className="mt-3 text-xs text-sky-500 hover:underline">
            SMSが届かない方へ
          </button>
        </div>
        <GradientButton type="submit" disabled={code.length !== 6}>
          次へ
        </GradientButton>
      </form>
    </OnboardingLayout>
  )
}
