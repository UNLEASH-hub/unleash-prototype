import { ProfileView, type Profile } from '@/components/profile/ProfileView'

const PROFILES: Record<string, Profile> = {
  '1': {
    id: '1',
    name: '知也',
    height: 175, weight: 65, age: 28,
    rating: 3.7,
    hasPhoto: true,
    photoCount: 1,
    isVerified: true,
    photoGradient: { from: '#F4A261', to: '#E76F51' },
    tags: ['タチ', 'ゲイ', 'バニラ派', 'ヤリモク', '場所あり', '足あり', 'Prep服用', '土日休み', 'サウナ好き', '複数', 'P18', 'INFJ'],
    bio: '都内住みです。\nよろしくお願いします！\n趣味は海外旅行とゲーム、スポーツです。\nフットサルやってる人いたら\nいっしょにやりましょう！',
    schedules: [
      { id: '1', date: '2026-05-22', time: '14:00', place: 'ホテル',   purpose: 'デートしたい' },
      { id: '2', date: '2026-05-25', time: '18:00', place: 'バー',     purpose: '一緒に飲みたい' },
      { id: '3', date: '2026-06-01', time: '10:00', place: 'ジム',     purpose: 'トレーニング仲間募集' },
      { id: '4', date: '2026-06-08', time: '19:00', place: 'クラブ',   purpose: '一緒に遊ぼう' },
    ],
  },
  '2': {
    id: '2',
    name: 'Kenji',
    height: 170, weight: 60, age: 25,
    rating: 4.2,
    hasPhoto: true,
    photoCount: 1,
    photoGradient: { from: '#2A9D8F', to: '#264653' },
    tags: ['ゲイ', 'ウケ', 'バニラ派', '都内在住', '平日休み'],
    bio: 'はじめまして！\n都内で働いています。\n気軽に話しかけてください。',
    schedules: [
      { id: '1', date: '2026-05-23', time: '20:00', place: 'バー',   purpose: '飲み友達募集' },
      { id: '2', date: '2026-05-30', time: '12:00', place: '現地集合', purpose: 'ランチしたい' },
    ],
  },
}

const GRADIENTS = [
  { from: '#8338EC', to: '#3A0CA3' },
  { from: '#F72585', to: '#7209B7' },
  { from: '#4CC9F0', to: '#4361EE' },
  { from: '#2A9D8F', to: '#264653' },
]

const NAMES = ['Takashi', 'Sho', 'Yuki', 'Hiro', 'Ryo', 'Daiki', 'Jun', 'Masa']
const TAG_POOL = ['ゲイ', 'タチ', 'ウケ', 'リバ', 'バニラ派', '都内在住', '土日休み', '平日休み', 'サウナ好き']

function generateProfile(id: string): Profile {
  const n = parseInt(id)
  return {
    id,
    name: NAMES[n % NAMES.length],
    height: 165 + (n * 3 % 20),
    weight: 55 + (n * 5 % 25),
    age: 20 + (n * 7 % 15),
    rating: Math.round((3 + (n * 0.3 % 2)) * 10) / 10,
    hasPhoto: n <= 4,
    photoGradient: GRADIENTS[n % GRADIENTS.length],
    tags: TAG_POOL.slice(0, 3 + (n % 4)),
    bio: 'よろしくお願いします！',
    schedules: [],
  }
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const profile = PROFILES[params.id] ?? generateProfile(params.id)

  return <ProfileView profile={profile} />
}
