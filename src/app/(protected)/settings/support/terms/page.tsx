import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="利用規約" backHref="/settings/support" />
      <main className="p-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-4 text-sm leading-relaxed">
            <h2 className="text-base font-bold text-gray-800">UNLEASH 利用規約</h2>
            <p>本規約は、UNLEASH（以下「当サービス」）の利用に関する条件を定めるものです。</p>

            <h3 className="font-bold text-gray-800">第1条（適用）</h3>
            <p>本規約は、当サービスの利用に関して、当社とユーザーとの間に適用されます。</p>

            <h3 className="font-bold text-gray-800">第2条（利用資格）</h3>
            <p>当サービスは18歳以上の方のみご利用いただけます。18歳未満の方の利用は固く禁じます。</p>

            <h3 className="font-bold text-gray-800">第3条（禁止事項）</h3>
            <p>ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>他のユーザーへの嫌がらせ・誹謗中傷</li>
              <li>個人情報の無断収集・利用</li>
              <li>当サービスの運営を妨害する行為</li>
            </ul>

            <h3 className="font-bold text-gray-800">第4条（免責事項）</h3>
            <p>当社はユーザー間のトラブルについて一切の責任を負いません。</p>

            <p className="text-xs text-gray-400 pt-4">最終更新：2026年5月</p>
          </div>
        </div>
      </main>
    </div>
  )
}
