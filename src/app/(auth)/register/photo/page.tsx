'use client'

import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

export default function PhotoPage() {
  const router = useRouter()

  return (
    <OnboardingLayout title={'アカウント写真を\n設定してください'} backHref="/register/profile">
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          {/* アップロードエリア */}
          <div className="flex justify-center mb-4">
            <button
              className="flex h-44 w-44 items-center justify-center rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              onClick={() => {}}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 8V32M8 20H32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">写真は後から追加・変更ができます</p>
          <p className="text-center text-xs text-gray-400">不適切な写真は自動的に削除されます</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-sky-500 mb-2">公開写真の規約</p>
            <p className="text-xs text-gray-500">× 極端に肌の露出が多い写真</p>
            <p className="text-xs text-gray-500">× 局部・性器が直接的に映っている写真</p>
          </div>
        </div>
        <GradientButton onClick={() => router.push('/register/tags')}>
          次へ
        </GradientButton>
      </div>
    </OnboardingLayout>
  )
}
