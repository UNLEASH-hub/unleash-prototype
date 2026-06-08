import Image from 'next/image'
import Link from 'next/link'

export default function StartPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-8">
      <div className="mb-14 flex flex-col items-center gap-4">
        <Image src="/icons/app_logo.png" alt="UNLEASH" width={120} height={120} className="rounded-3xl" />
        <Image src="/icons/logo.jpg" alt="UNLEASH" width={160} height={50} className="object-contain" />
      </div>

      <div className="w-full space-y-3">
        <Link
          href="/register"
          className="block w-full rounded-full py-4 text-center text-base font-semibold text-white"
          style={{ background: 'linear-gradient(to right, #0284C7, #2563EB)' }}
        >
          新規登録はこちら
        </Link>
        <Link
          href="/login"
          className="block w-full rounded-full py-4 text-center text-base font-semibold text-white"
          style={{ background: 'linear-gradient(to right, #38BDF8, #0EA5E9)' }}
        >
          アカウントにログイン
        </Link>
      </div>

      <div className="mt-10 flex gap-10 text-xs text-gray-400">
        <button className="hover:text-gray-600 transition-colors">利用規約</button>
        <button className="hover:text-gray-600 transition-colors">プライバシーポリシー</button>
      </div>
    </div>
  )
}
