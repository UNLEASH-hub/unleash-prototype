'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push('/users')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
        style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
      <p className="text-center text-sm text-gray-500">
        アカウントをお持ちでない方は{' '}
        <Link href="/signup" className="text-sky-500 hover:underline">新規登録</Link>
      </p>
    </form>
  )
}
