export type WantRequest = {
  id: string
  toUserId: string
  toUserName: string
  toUserHasPhoto: boolean
  toUserGradient?: { from: string; to: string }
  date: string
  time: string
  place: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

const KEY = 'want_requests'

export function getRequests(): WantRequest[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveRequest(req: Omit<WantRequest, 'id' | 'createdAt' | 'status'>): WantRequest {
  const full: WantRequest = {
    ...req,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(KEY, JSON.stringify([...getRequests(), full]))
  return full
}

export function updateRequestStatus(id: string, status: 'accepted' | 'rejected'): void {
  const all = getRequests().map(r => r.id === id ? { ...r, status } : r)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function formatWantDate(dateStr: string, time: string): string {
  const DAYS = ['日', '月', '火', '水', '木', '金', '土']
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${DAYS[d.getDay()]} ${time}〜`
}

export function todayDateStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
