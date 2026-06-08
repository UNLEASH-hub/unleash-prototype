import { SettingsHeader } from '@/components/settings/SettingsHeader'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="プライバシーポリシー" backHref="/settings/support" />
      <main className="p-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="space-y-4 text-sm leading-relaxed text-gray-700">
            <h2 className="text-base font-bold text-gray-800">プライバシーポリシー</h2>
            <p>当社は、ユーザーの個人情報保護を最重要事項と考え、以下の方針に基づき適切に取り扱います。</p>

            <h3 className="font-bold text-gray-800">1. 収集する情報</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>登録情報（電話番号、プロフィール情報）</li>
              <li>利用状況データ（ログイン履歴、行動ログ）</li>
              <li>端末情報（OS、IPアドレス）</li>
            </ul>

            <h3 className="font-bold text-gray-800">2. 利用目的</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>サービスの提供・改善</li>
              <li>不正利用の防止</li>
              <li>お問い合わせへの対応</li>
            </ul>

            <h3 className="font-bold text-gray-800">3. 第三者提供</h3>
            <p>当社は、法令に定める場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。</p>

            <h3 className="font-bold text-gray-800">4. セキュリティ</h3>
            <p>個人情報への不正アクセスや漏洩を防ぐため、適切なセキュリティ対策を実施しています。</p>

            <h3 className="font-bold text-gray-800">5. お問い合わせ</h3>
            <p>個人情報に関するお問い合わせは、設定内「お問い合わせ」よりご連絡ください。</p>

            <p className="pt-4 text-xs text-gray-400">最終更新：2026年5月</p>
          </div>
        </div>
      </main>
    </div>
  )
}
