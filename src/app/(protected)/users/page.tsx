import { type DummyUser } from '@/components/users/UserCard'
import { BottomNav } from '@/components/layout/BottomNav'
import { UsersClientWrapper } from '@/components/users/UsersClientWrapper'

function generateDistance(index: number): string {
  if (index === 0) return '0m'
  if (index < 5) return `${(index * 120).toFixed(0)}m`
  if (index < 15) return `${((index - 4) * 0.4 + 0.5).toFixed(1)}km`
  if (index < 40) return `${((index - 14) * 0.6 + 4.5).toFixed(1)}km`
  return `${((index - 39) * 1.2 + 19).toFixed(1)}km`
}

const PHOTO_GRADIENTS = [
  { from: '#F4A261', to: '#E76F51' },
  { from: '#2A9D8F', to: '#264653' },
  { from: '#8338EC', to: '#3A0CA3' },
  { from: '#F72585', to: '#7209B7' },
  { from: '#4CC9F0', to: '#4361EE' },
]

const ALL_TAGS = [
  'ゲイ', 'バイ', 'タチ', 'ウケ', 'リバ',
  'バニラ派', 'ヤリモク', '場所あり', '足あり',
  '都内在住', '土日休み', '平日休み', 'サウナ好き', 'Prep服用',
]

const TODAY_TIMES = ['12:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00']
const TODAY_PLACES = ['自宅', 'ホテル', 'バー', 'クラブ', 'ジム', '現地集合']
const TODAY_PURPOSES = ['一緒に飲みたい', 'デートしたい', 'サウナ行きたい', '散歩・お出かけ', '食事したい', '気軽に話したい']
const NAMES = ['ケンジ', 'ヒロ', 'タイチ', 'ショウ', 'ユウキ', 'レン', 'ソウタ', 'ハルト', 'コウキ', 'リョウ',
  'アキト', 'ナオヤ', 'ツバサ', 'カイト', 'ダイキ', 'ユウト', 'コウセイ', 'アオイ', 'リク', 'ハルキ']

function getUserName(i: number): string {
  return NAMES[i % NAMES.length]
}

const TOKYO_LAT = 35.6895
const TOKYO_LNG = 139.6917

function getUserCoords(i: number): { lat: number; lng: number } {
  const seed = (i * 7 + 13) % 97
  const angle = (seed / 97) * 2 * Math.PI
  const radius = (((i * 3 + 7) % 15) / 15) * 0.135  // ~15km max (0.135 degrees)
  return {
    lat: TOKYO_LAT + Math.sin(angle) * radius,
    lng: TOKYO_LNG + Math.cos(angle) * radius * 1.2,
  }
}

function getUserTags(i: number): string[] {
  return ALL_TAGS.filter((_, ti) => (i + ti * 2 + 1) % 3 === 0 || (i * 3 + ti) % 7 === 0).slice(0, 3 + (i % 4))
}

function getScheduleToday(i: number): { time: string; place: string; purpose: string } | undefined {
  if (i % 3 !== 0) return undefined
  return {
    time: TODAY_TIMES[i % TODAY_TIMES.length],
    place: TODAY_PLACES[i % TODAY_PLACES.length],
    purpose: TODAY_PURPOSES[i % TODAY_PURPOSES.length],
  }
}

const DUMMY_USERS: DummyUser[] = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1
  return {
    id: String(n),
    name: getUserName(i),
    distance: generateDistance(i),
    ...getUserCoords(i),
    isPremium: [2, 5, 9, 14, 20, 27, 35, 44, 55, 68].includes(i),
    hasPhoto: i < 4,
    photoGradient: i < 5 ? PHOTO_GRADIENTS[i % PHOTO_GRADIENTS.length] : undefined,
    tags: getUserTags(i),
    scheduleToday: getScheduleToday(i),
    height: 165 + (n * 3 % 20),
    weight: 55 + (n * 5 % 25),
    age: 20 + (n * 7 % 15),
  }
})

export default async function UsersPage() {
  return (
    <>
      <UsersClientWrapper initialUsers={DUMMY_USERS} />
      <BottomNav />
    </>
  )
}
