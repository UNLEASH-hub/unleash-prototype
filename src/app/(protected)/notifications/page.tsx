import { NotificationsView } from '@/components/notifications/NotificationsView'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NotificationsView />
      <BottomNav />
    </div>
  )
}
