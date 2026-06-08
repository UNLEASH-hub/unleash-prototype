'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

function UnderlineField({
  label, placeholder, value, onChange, suffix, type = 'text',
}: {
  label: string; placeholder?: string; value: string
  onChange: (v: string) => void; suffix?: string; type?: string
}) {
  return (
    <div className="flex items-center border-b border-gray-300 py-3 gap-3">
      <span className="w-10 text-sm text-gray-400 flex-shrink-0">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none text-center"
      />
      {suffix && <span className="text-sm text-gray-400 flex-shrink-0">{suffix}</span>}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const handleNext = () => {
    sessionStorage.setItem('reg_profile', JSON.stringify({ name, age, height, weight }))
    router.push('/register/photo')
  }

  return (
    <OnboardingLayout title={'プロフィールを\n入力してください'} backHref="/register/language">
      <div className="flex flex-1 flex-col">
        <div className="space-y-1 flex-1">
          <div className="border-b border-gray-300 py-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="相手に表示されるユーザー名"
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <UnderlineField label="年齢" value={age} onChange={setAge} type="number" suffix="歳" />
          <UnderlineField label="身長" value={height} onChange={setHeight} type="number" suffix="cm" placeholder="168.8" />
          <UnderlineField label="体重" value={weight} onChange={setWeight} type="number" suffix="kg" placeholder="62.3" />
          <p className="pt-2 text-xs text-gray-400">※プロフィール情報は後から修正・変更ができます</p>
        </div>
        <GradientButton onClick={handleNext} disabled={!name || !age}>
          次へ
        </GradientButton>
      </div>
    </OnboardingLayout>
  )
}
