'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type Props = {
  initialLat: number
  initialLng: number
  onCenterChange: (lat: number, lng: number) => void
}

function MapEventHandler({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      onCenterChange(center.lat, center.lng)
    },
  })
  return null
}

export default function LocationPickerMap({ initialLat, initialLng, onCenterChange }: Props) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      onCenterChange(initialLat, initialLng)
      initialized.current = true
    }
  }, [initialLat, initialLng, onCenterChange])

  return (
    <MapContainer
      center={[initialLat, initialLng]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapEventHandler onCenterChange={onCenterChange} />
    </MapContainer>
  )
}
