'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

const LANGUAGES = ['日本語', 'English', '中文', '한국어', 'Español']

export default function LanguagePage() {
  const router = useRouter()
  const [language, setLanguage] = useState('日本語')

  return (
    <OnboardingLayout title="言語を選択してください" backHref="/register/terms">
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <div className="relative">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
        <GradientButton onClick={() => router.push('/register/profile')}>
          完了
        </GradientButton>
      </div>
    </OnboardingLayout>
  )
}
