'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.push('/start')} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
      ログアウト
    </button>
  )
}
