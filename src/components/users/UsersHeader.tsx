'use client'

import Image from 'next/image'
import { BADGE_CATEGORIES } from '@/lib/badges-data'

export const TABS = ['付近を検索', 'バッジ検索', '今日会える'] as const
export type TabType = typeof TABS[number]

type Props = {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  selectedTags: Set<string>
  onTagToggle: (tag: string) => void
  onFilter: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
  onOpenMap?: () => void
  searchLabel?: string
}

export function UsersHeader({
  activeTab, onTabChange,
  selectedTags, onTagToggle, onFilter,
  onRefresh, isRefreshing,
  onOpenMap, searchLabel,
}: Props) {
  const isTagTab = activeTab === 'バッジ検索'

  return (
    <header className="bg-white border-b border-gray-100">
      {/* アイコン行 */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <Image src="/icons/app_logo.png" alt="UNLEASH" width={36} height={36} className="rounded-lg" />
        {onRefresh && !isTagTab && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 disabled:opacity-50 active:bg-gray-200"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            位置情報を更新
          </button>
        )}
        {isTagTab && selectedTags.size > 0 && (
          <button
            onClick={() => { onTagToggle('__reset__') }}
            className="text-xs font-medium text-sky-500"
          >
            リセット
          </button>
        )}
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-100">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-sky-500 border-b-2 border-sky-500'
                : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 付近を検索: 検索バー */}
      {!isTagTab && (
        <div className="px-3 py-2">
          <button
            onClick={onOpenMap}
            className="flex w-full items-center gap-2 rounded-full bg-gray-100 px-4 py-2 active:bg-gray-200"
          >
            {searchLabel ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6z" fill="#0EA5E9" />
                  <circle cx="12" cy="8" r="2.5" fill="white" />
                </svg>
                <span className="flex-1 text-left text-xs font-medium text-sky-500 truncate">{searchLabel}</span>
              </>
            ) : (
              <>
                <span className="flex-1 text-left text-xs text-gray-400">位置から検索する</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="#9CA3AF" strokeWidth="1.5" />
                  <path d="M11 11L14 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* バッジ検索: カテゴリー付きタグパネル */}
      {isTagTab && (
        <div className="flex flex-col" style={{ maxHeight: '52vw' }}>
          <div className="overflow-y-auto px-3 pt-2.5 pb-1 space-y-3">
            {BADGE_CATEGORIES.map(category => (
              <div key={category.label}>
                <p className="mb-1.5 text-[10px] font-bold text-gray-400 tracking-wider">{category.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {category.tags.map(tag => {
                    const active = selectedTags.has(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => onTagToggle(tag)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          active ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-gray-100 bg-white">
            <button
              onClick={onFilter}
              className="w-full rounded-full py-2.5 text-sm font-bold text-white transition-opacity"
              style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
            >
              {selectedTags.size > 0 ? `絞り込む（${selectedTags.size}件選択中）` : '絞り込む'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
