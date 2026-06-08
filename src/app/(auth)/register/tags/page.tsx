'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { GradientButton } from '@/components/onboarding/GradientButton'

const TAGS = [
  'ゲイ', 'バイ', 'ノンケ寄り',
  '友だち募集', '恋人募集', 'その他募集',
  'タチ', 'ウケ', 'リバ',
  'バニラ派', 'ポジション不明', 'トランス',
]

export default function TagsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter(t => t !== tag))
    } else if (selected.length < 3) {
      setSelected([...selected, tag])
    }
  }

  const handleNext = () => {
    sessionStorage.setItem('reg_tags', JSON.stringify(selected))
    router.push('/register/bio')
  }

  return (
    <OnboardingLayout title={'パーソナルタグを\n1つ〜3つ設定してください'} backHref="/register/photo">
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selected.includes(tag)
                    ? 'text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}
                style={selected.includes(tag)
                  ? { background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }
                  : {}
                }
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            パーソナルタグはこの他にも様々な項目が用意されています{'\n'}
            あとからご自身にあったタグを追加・変更が可能です
          </p>
        </div>
        <GradientButton onClick={handleNext} disabled={selected.length === 0}>
          次へ
        </GradientButton>
      </div>
    </OnboardingLayout>
  )
}
