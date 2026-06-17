export type ActionNotif = {
  id: string
  type: 'message' | 'favorite' | 'want_to_meet' | 'review'
  username: string | null
  avatarGradient: { from: string; to: string }
  photoId?: string
  timestamp: string
  isRead: boolean
  messagePreview?: string
  reviewText?: string
}

export const ACTION_NOTIFICATIONS: ActionNotif[] = [
  {
    id: '1',
    type: 'message',
    username: 'Ryo',
    avatarGradient: { from: '#F4A261', to: '#E76F51' },
    photoId: '5',
    timestamp: '2分前',
    isRead: false,
  },
  {
    id: '2',
    type: 'favorite',
    username: 'Daiki',
    avatarGradient: { from: '#8338EC', to: '#3A0CA3' },
    photoId: '6',
    timestamp: '30分前',
    isRead: false,
  },
  {
    id: 'r1',
    type: 'review',
    username: null,
    avatarGradient: { from: '#F59E0B', to: '#D97706' },
    timestamp: '1時間前',
    isRead: false,
    reviewText: 'また会いたい',
  },
  {
    id: '3',
    type: 'want_to_meet',
    username: 'Sho',
    avatarGradient: { from: '#F72585', to: '#7209B7' },
    photoId: '4',
    timestamp: '1時間前',
    isRead: false,
  },
  {
    id: '4',
    type: 'message',
    username: 'Kenji',
    avatarGradient: { from: '#2A9D8F', to: '#264653' },
    photoId: '2',
    timestamp: '45分前',
    isRead: true,
  },
  {
    id: '5',
    type: 'favorite',
    username: 'Jun',
    avatarGradient: { from: '#4CC9F0', to: '#4361EE' },
    photoId: '3',
    timestamp: '2時間前',
    isRead: true,
  },
  {
    id: 'r2',
    type: 'review',
    username: null,
    avatarGradient: { from: '#F59E0B', to: '#D97706' },
    timestamp: '3時間前',
    isRead: true,
    reviewText: 'プロフィール通りだった',
  },
  {
    id: '6',
    type: 'message',
    username: 'Takashi',
    avatarGradient: { from: '#F4A261', to: '#E76F51' },
    photoId: '7',
    timestamp: '3時間前',
    isRead: true,
  },
  {
    id: '7',
    type: 'want_to_meet',
    username: 'Masa',
    avatarGradient: { from: '#2A9D8F', to: '#264653' },
    photoId: '8',
    timestamp: '昨日',
    isRead: true,
  },
  {
    id: '8',
    type: 'favorite',
    username: 'Ren',
    avatarGradient: { from: '#8338EC', to: '#3A0CA3' },
    photoId: '9',
    timestamp: '昨日',
    isRead: true,
  },
]

export const hasUnreadNotifications = ACTION_NOTIFICATIONS.some(n => !n.isRead)
