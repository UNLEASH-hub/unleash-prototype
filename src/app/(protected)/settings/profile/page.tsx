import { SettingsHeader, NavRow, SettingsGroup } from '@/components/settings/SettingsHeader'

export default async function ProfileSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsHeader title="プロフィール設定" backHref="/settings" />
      <main className="p-4 space-y-4">
        <SettingsGroup>
          <NavRow href="/settings/profile/photo"        label="写真" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/profile/secret-photo" label="シークレットフォト" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/profile/stats"        label="身長・体重・年齢" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/profile/bio"          label="自己紹介文" />
          <div className="mx-4 h-px bg-gray-100" />
          <NavRow href="/settings/profile/badges"       label="バッジ設定" />
        </SettingsGroup>
      </main>
    </div>
  )
}
