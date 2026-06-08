'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

function UnderlineInput({
  placeholder, type = 'text', value, onChange, suffix,
}: {
  placeholder: string; type?: string; value: string
  onChange: (v: string) => void; suffix?: string
}) {
  return (
    <div className="flex items-center border-b border-gray-300 py-3">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
      />
      {suffix && <span className="ml-2 text-sm text-gray-400">{suffix}</span>}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ダミー: sessionStorageに電話番号を保存してOTP画面へ
    sessionStorage.setItem('reg_phone', phone)
    router.push('/register/verify')
  }

  return (
    <OnboardingLayout
      title={'電話番号とパスワード・招待コード\nを入力してください'}
      backHref="/start"
    >
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="space-y-2 flex-1">
          <UnderlineInput
            placeholder="電話番号 (例: 09012345678)"
            type="tel"
            value={phone}
            onChange={setPhone}
          />
          <UnderlineInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          <UnderlineInput
            placeholder="招待コード (任意)"
            value={inviteCode}
            onChange={setInviteCode}
          />
        </div>
        <div className="mt-8">
          <GradientButton type="submit" disabled={!phone || !password}>
            認証コードを送る
          </GradientButton>
        </div>
      </form>
    </OnboardingLayout>
  )
}
