'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

const MAX_LENGTH = 200

export default function BioPage() {
  const router = useRouter()
  const [bio, setBio] = useState('')

  const handleComplete = () => {
    sessionStorage.setItem('reg_bio', bio)
    router.push('/welcome')
  }

  return (
    <OnboardingLayout title={'最後に自己紹介文を\n入力してください'} backHref="/register/tags">
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, MAX_LENGTH))}
              placeholder={'最近始めました。\n友だちからよろしくお願いします。'}
              rows={5}
              className="w-full resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <p className="mt-1 text-right text-xs text-gray-400">
            残り文字数：{MAX_LENGTH - bio.length}文字
          </p>
          <p className="mt-1 text-xs text-gray-400">※自己紹介文も後から修正・変更ができます</p>
        </div>
        <GradientButton onClick={handleComplete} disabled={bio.trim().length === 0}>
          登録を完了する
        </GradientButton>
      </div>
    </OnboardingLayout>
  )
}
