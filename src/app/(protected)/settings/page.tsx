import { SettingsView } from '@/components/settings/SettingsView'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SettingsView />
      <BottomNav />
    </div>
  )
}
