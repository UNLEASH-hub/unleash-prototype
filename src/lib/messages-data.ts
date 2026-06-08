export type Conversation = {
  id: string
  username: string
  height: number
  weight: number
  age: number
  hasPhoto: boolean
  photoGradient?: { from: string; to: string }
  lastMessage: string
  timestamp: string
  unread: boolean
  autoCreated?: boolean
}

const CONV_KEY = 'auto_conversations'

export function getExtraConversations(): Conversation[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CONV_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveConversation(conv: Conversation): void {
  const existing = getExtraConversations()
  if (existing.some(c => c.id === conv.id)) return
  localStorage.setItem(CONV_KEY, JSON.stringify([conv, ...existing]))
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    username: '知也',
    height: 175, weight: 65, age: 28,
    hasPhoto: true,
    photoGradient: { from: '#F4A261', to: '#E76F51' },
    lastMessage: '今夜、会えますか？',
    timestamp: '12分前',
    unread: true,
  },
  {
    id: '2',
    username: 'Kenji',
    height: 170, weight: 60, age: 25,
    hasPhoto: false,
    lastMessage: 'はじめまして！よろしくお願いします',
    timestamp: '45分前',
    unread: true,
  },
  {
    id: '3',
    username: 'Takashi',
    height: 178, weight: 72, age: 31,
    hasPhoto: false,
    lastMessage: 'ありがとうございます！',
    timestamp: '3時間前',
    unread: false,
  },
  {
    id: '4',
    username: 'Sho',
    height: 168, weight: 58, age: 24,
    hasPhoto: false,
    lastMessage: 'よろしくお願いします！',
    timestamp: '昨日',
    unread: false,
  },
  {
    id: '5',
    username: 'Yuki',
    height: 172, weight: 63, age: 27,
    hasPhoto: false,
    lastMessage: 'またお話しましょうね',
    timestamp: '昨日',
    unread: false,
  },
  {
    id: '6',
    username: 'Hiro',
    height: 180, weight: 75, age: 33,
    hasPhoto: false,
    lastMessage: 'こちらこそよろしくです！',
    timestamp: '2日前',
    unread: false,
  },
]

export const hasUnreadMessages = CONVERSATIONS.some(c => c.unread)
