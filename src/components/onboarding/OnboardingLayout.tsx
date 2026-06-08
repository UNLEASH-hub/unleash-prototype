import Image from 'next/image'
import Link from 'next/link'

type Props = {
  title: string
  backHref?: string
  children: React.ReactNode
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function OnboardingLayout({ title, backHref, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-10">
      <div className="h-12 flex items-center">
        {backHref && (
          <Link href={backHref} className="text-gray-500 hover:text-gray-800 transition-colors">
            <BackIcon />
          </Link>
        )}
      </div>
      <div className="flex flex-col items-center text-center mb-10">
        <Image
          src="/icons/app_logo.png"
          alt="UNLEASH"
          width={48}
          height={48}
          className="rounded-xl mb-5"
        />
        <h1 className="text-2xl font-bold text-gray-900 leading-snug whitespace-pre-line">
          {title}
        </h1>
      </div>
      {children}
    </div>
  )
}
