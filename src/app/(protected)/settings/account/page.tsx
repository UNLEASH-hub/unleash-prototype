import { SettingsHeader, NavRow, SettingsGroup } from '@/components/settings/SettingsHeader'

export default async function AccountSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="アカウント設定" backHref="/settings" />
      <main className="p-4 space-y-4">
        <SettingsGroup>
          <NavRow href="/settings/account/verification" label="本人確認" />
        </SettingsGroup>
        <SettingsGroup>
          <NavRow href="/settings/account/email"    label="アドレス変更" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/account/password" label="パスワード変更" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/account/referral" label="友だち紹介コード" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/account/blocked"  label="ブロックリスト" />
        </SettingsGroup>
      </main>
    </div>
  )
}
