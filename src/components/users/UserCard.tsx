import Link from 'next/link'

export type DummyUser = {
  id: string
  name: string
  distance: string
  lat: number
  lng: number
  isPremium: boolean
  hasPhoto: boolean
  photoGradient?: { from: string; to: string }
  tags: string[]
  scheduleToday?: { time: string; place: string; purpose: string }
}

function PersonPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-3" style={{ background: '#4ECDC4' }}>
      <svg viewBox="0 0 80 80" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
        <circle cx="40" cy="28" r="16" fill="rgba(255,255,255,0.45)" />
        <ellipse cx="40" cy="75" rx="26" ry="18" fill="rgba(255,255,255,0.45)" />
      </svg>
    </div>
  )
}

type TodayRowProps = {
  user: DummyUser
  isWanted: boolean
  onWantPress: () => void
}

export function TodayUserRow({ user, isWanted, onWantPress }: TodayRowProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      {/* アイコン */}
      <Link href={`/users/${user.id}`} className="flex-shrink-0">
        <div className="relative h-11 w-11 overflow-hidden rounded-full"
          style={user.isPremium ? { outline: '2px solid #0EA5E9', outlineOffset: '-2px' } : {}}>
          {user.hasPhoto ? (
            <img src={`/images/users/${user.id}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : user.photoGradient ? (
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${user.photoGradient.from}, ${user.photoGradient.to})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: '#4ECDC4' }}>
              <svg viewBox="0 0 80 80" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
                <circle cx="40" cy="28" r="16" fill="rgba(255,255,255,0.45)" />
                <ellipse cx="40" cy="75" rx="26" ry="18" fill="rgba(255,255,255,0.45)" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* 中央: 名前 / 時間・場所 / purpose */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
        {user.scheduleToday && (
          <>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-xs text-gray-500">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.8" />
                  <path d="M12 7v5l3 3" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {user.scheduleToday.time}〜
              </span>
              <span className="flex items-center gap-0.5 text-xs text-gray-500">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6z" stroke="#9CA3AF" strokeWidth="1.8" />
                  <circle cx="12" cy="8" r="2" stroke="#9CA3AF" strokeWidth="1.6" />
                </svg>
                {user.scheduleToday.place}
              </span>
            </div>
            <span className="mt-1 inline-block rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
              {user.scheduleToday.purpose}
            </span>
          </>
        )}
      </div>

      {/* 会いたいボタン */}
      <button
        onClick={onWantPress}
        className={`flex flex-shrink-0 flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors ${
          isWanted ? 'bg-red-50' : 'bg-gray-100 active:bg-gray-200'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isWanted ? '#EF4444' : 'none'}>
          <path d="M12 21C12 21 3 13.5 3 7.5C3 5.01 5.01 3 7.5 3C9.24 3 10.91 4.01 12 5.5C13.09 4.01 14.76 3 16.5 3C18.99 3 21 5.01 21 7.5C21 13.5 12 21 12 21Z"
            stroke={isWanted ? '#EF4444' : '#9CA3AF'} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span className={`text-[10px] font-semibold ${isWanted ? 'text-red-400' : 'text-gray-400'}`}>会いたい</span>
      </button>
    </div>
  )
}

type Props = { user: DummyUser; showScheduleInfo?: boolean }

export function UserCard({ user, showScheduleInfo }: Props) {
  return (
    <Link href={`/users/${user.id}`} className="block">
      <div
        className="relative aspect-square overflow-hidden"
        style={user.isPremium ? { outline: '2.5px solid #0EA5E9', outlineOffset: '-2.5px' } : {}}
      >
        {user.hasPhoto ? (
          <img src={`/images/users/${user.id}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : user.photoGradient ? (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${user.photoGradient.from}, ${user.photoGradient.to})` }}
          />
        ) : (
          <PersonPlaceholder />
        )}

        {/* 今日会えるバッジ / 距離ラベル */}
        {showScheduleInfo && user.scheduleToday ? (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-5">
            <p className="text-[11px] font-bold leading-tight text-white">
              {user.scheduleToday.time}〜
            </p>
            <p className="text-[9px] leading-tight text-white/80">{user.scheduleToday.place}</p>
          </div>
        ) : (
          <div className="absolute bottom-1 left-1.5">
            <span className="text-[11px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {user.distance}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
