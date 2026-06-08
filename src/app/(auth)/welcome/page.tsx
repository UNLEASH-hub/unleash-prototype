'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()

  // 3秒後に自動でメイン画面へ
  useEffect(() => {
    const t = setTimeout(() => router.push('/users'), 3000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-5">
      <Image src="/icons/app_logo.png" alt="UNLEASH" width={120} height={120} className="rounded-3xl" />
      <Image src="/icons/logo.jpg" alt="UNLEASH" width={160} height={50} className="object-contain" />
      <p className="text-xl font-semibold text-gray-800">Wellcome to UNLEASH！</p>
    </div>
  )
}
