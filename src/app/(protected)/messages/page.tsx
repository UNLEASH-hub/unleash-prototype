import { MessagesListView } from '@/components/messages/MessagesListView'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function MessagesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MessagesListView />
      <BottomNav />
    </div>
  )
}
