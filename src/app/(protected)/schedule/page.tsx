import { ScheduleView } from '@/components/schedule/ScheduleView'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function SchedulePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScheduleView />
      <BottomNav />
    </div>
  )
}
