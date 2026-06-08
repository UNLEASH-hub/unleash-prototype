import { SettingsHeader, NavRow, SettingsGroup } from '@/components/settings/SettingsHeader'

export default async function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="サポート" backHref="/settings" />
      <main className="p-4 space-y-4">
        <SettingsGroup>
          <NavRow href="/settings/support/contact" label="お問い合わせ" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/support/terms"   label="利用規約" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/support/privacy" label="プライバシーポリシー" />
        </SettingsGroup>

        <SettingsGroup>
          <NavRow href="/settings/support/delete-account" label="退会" danger />
        </SettingsGroup>
      </main>
    </div>
  )
}
