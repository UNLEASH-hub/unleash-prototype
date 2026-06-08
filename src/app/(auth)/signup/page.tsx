import Image from 'next/image'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <Image src="/icons/logo.jpg" alt="UNLEASH" width={180} height={54} className="mx-auto object-contain" />
        <p className="mt-3 text-sm text-gray-400">新規登録</p>
      </div>
      <div className="w-full">
        <SignupForm />
      </div>
    </div>
  )
}
