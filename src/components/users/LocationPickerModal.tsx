'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false })

const INITIAL_LAT = 35.6812
const INITIAL_LNG = 139.7671

type Props = {
  onConfirm: (lat: number, lng: number) => void
  onClose: () => void
}

export function LocationPickerModal({ onConfirm, onClose }: Props) {
  const [center, setCenter] = useState({ lat: INITIAL_LAT, lng: INITIAL_LNG })

  const handleCenterChange = useCallback((lat: number, lng: number) => {
    setCenter({ lat, lng })
  }, [])

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <button onClick={onClose} className="text-sm text-gray-500">
          キャンセル
        </button>
        <h2 className="text-sm font-bold text-gray-800">場所を選択</h2>
        <div className="w-14" />
      </div>

      {/* 地図エリア */}
      <div className="relative flex-1">
        <LocationPickerMap
          initialLat={INITIAL_LAT}
          initialLng={INITIAL_LNG}
          onCenterChange={handleCenterChange}
        />

        {/* 中央固定ピン */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative -mt-6">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
              <path
                d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
                fill="#0EA5E9"
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="border-t border-gray-100 p-4 pb-8">
        <button
          onClick={() => onConfirm(center.lat, center.lng)}
          className="w-full rounded-full py-3 text-sm font-bold text-white"
          style={{ background: 'linear-gradient(to right, #0EA5E9, #2563EB)' }}
        >
          この付近で検索
        </button>
      </div>
    </div>
  )
}
