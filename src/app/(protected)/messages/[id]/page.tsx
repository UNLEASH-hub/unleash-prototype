import { ChatView } from '@/components/messages/ChatView'

const CONVERSATION_META: Record<string, { username: string; photoId?: string; avatarGradient?: { from: string; to: string } }> = {
  '1': { username: '知也',    photoId: '1', avatarGradient: { from: '#F4A261', to: '#E76F51' } },
  '2': { username: 'Kenji',   photoId: '2', avatarGradient: { from: '#2A9D8F', to: '#264653' } },
  '3': { username: 'Takashi', photoId: '3', avatarGradient: { from: '#8338EC', to: '#3A0CA3' } },
  '4': { username: 'Sho',     photoId: '4', avatarGradient: { from: '#4CC9F0', to: '#4361EE' } },
  '5': { username: 'Yuki',    photoId: '5', avatarGradient: { from: '#F72585', to: '#7209B7' } },
  '6': { username: 'Hiro',    photoId: '6', avatarGradient: { from: '#2A9D8F', to: '#264653' } },
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const meta = CONVERSATION_META[params.id] ?? { username: 'ユーザー' }

  return (
    <ChatView
      conversationId={params.id}
      username={meta.username}
      photoId={meta.photoId}
      avatarGradient={meta.avatarGradient}
    />
  )
}
