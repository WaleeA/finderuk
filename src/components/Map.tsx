'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, LatLngExpression, LatLng, Marker as LeafletMarker } from 'leaflet'
import { Mosque } from '@/types'
import { SAMPLE_MOSQUES } from '@/data/mosques'
import { calculateDistance } from '@/lib/utils'

const mosqueIcon = new Icon({
  iconUrl: '/mosque-marker.svg',
  iconSize: [20, 20],
})

const userIcon = new Icon({
  iconUrl: '/user-marker.svg',
  iconSize: [20, 20],
})

interface MapProps {
  onMosqueSelect: (mosque: Mosque) => void
  onNearestMosquesChange: (mosques: Mosque[]) => void
  userLocation: [number, number] | null
  lineCount: number
}

function CenterMarker({ onPositionChange }: { onPositionChange: (position: LatLng) => void }) {
  const map = useMap()
  const [position, setPosition] = useState(map.getCenter())
  const markerRef = useRef<LeafletMarker>(null)

  useEffect(() => {
    const updatePosition = () => {
      const newPos = map.getCenter()
      setPosition(newPos)
      onPositionChange(newPos)
    }
    
    map.on('move', updatePosition)
    return () => {
      map.off('move', updatePosition)
    }
  }, [map, onPositionChange])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position)
    }
  }, [position])

  return (
    <Marker position={position} icon={userIcon} ref={markerRef}>
      <Popup className="bg-black/90 text-white border-neutral-800">
        <div className="p-2">
          <h3 className="font-semibold">Placed Marker</h3>
          <p className="text-sm text-neutral-400">Move the map to update</p>
        </div>
      </Popup>
    </Marker>
  )
}

function MapEvents({
  onMosqueSelect,
  onNearestMosquesChange,
  lineCount,
}: {
  onMosqueSelect: (mosque: Mosque) => void;
  onNearestMosquesChange: (mosques: Mosque[]) => void;
  lineCount: number;
}) {
  const map = useMap();

  const updateNearestMosques = useCallback(
    (center: LatLng) => {
      const mosquesWithDistance = SAMPLE_MOSQUES.map((mosque) => ({
        ...mosque,
        distance: calculateDistance(center.lat, center.lng, mosque.lat, mosque.lng),
      }))
        .sort((a, b) => a.distance! - b.distance!)
        .slice(0, lineCount);

      onMosqueSelect(mosquesWithDistance[0]);
      onNearestMosquesChange(mosquesWithDistance);
    },
    [onMosqueSelect, onNearestMosquesChange, lineCount]
  );

  useMapEvents({
    moveend: () => {
      updateNearestMosques(map.getCenter());
    },
  });

  return null;
}


export default function Map({ onMosqueSelect, onNearestMosquesChange, userLocation, lineCount }: MapProps) {
  const [nearestMosques, setNearestMosques] = useState<Mosque[]>([])
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null)
  const [mapCenter, setMapCenter] = useState<LatLng>(new LatLng(51.5074, -0.1278))
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (userLocation && mapRef.current) {
      const newCenter = new LatLng(userLocation[0], userLocation[1])
      mapRef.current.setView(newCenter, 13)
      setMapCenter(newCenter)
    }
  }, [userLocation])

  const handleNearestMosquesChange = useCallback((mosques: Mosque[]) => {
    setNearestMosques(mosques)
    onNearestMosquesChange(mosques)
  }, [onNearestMosquesChange])

  const handleMosqueSelect = useCallback((mosque: Mosque) => {
    setSelectedMosque(mosque)
    onMosqueSelect(mosque)
  }, [onMosqueSelect])

  const handleCenterChange = useCallback((newCenter: LatLng) => {
    setMapCenter(newCenter)
  }, [])

  const lines = useMemo(() => {
    return nearestMosques.map(mosque => [
      [mapCenter.lat, mapCenter.lng],
      [mosque.lat, mosque.lng]
    ])
  }, [mapCenter, nearestMosques])

  const handleMapCreated = useCallback((map: L.Map) => {
    mapRef.current = map
    // Calculate initial nearest mosques based on default center
    const center = map.getCenter()
    const mosquesWithDistance = SAMPLE_MOSQUES.map((mosque) => ({
      ...mosque,
      distance: calculateDistance(center.lat, center.lng, mosque.lat, mosque.lng),
    }))
      .sort((a, b) => a.distance! - b.distance!)
      .slice(0, lineCount);

    setNearestMosques(mosquesWithDistance)
    onNearestMosquesChange(mosquesWithDistance)
    onMosqueSelect(mosquesWithDistance[0])
  }, [lineCount, onMosqueSelect, onNearestMosquesChange])

  return (
    <MapContainer
      center={[51.5074, -0.1278]}
      zoom={13}
      style={{ height: 'calc(100vh - 4rem)', width: '100%' }}
      className="bg-neutral-900 z-0"
      ref={mapRef}
      whenCreated={handleMapCreated}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {SAMPLE_MOSQUES.map((mosque) => (
        <Marker
          key={mosque.id}
          position={[mosque.lat, mosque.lng]}
          icon={mosqueIcon}
          eventHandlers={{
            click: () => handleMosqueSelect(mosque)
          }}
        >
          <Popup className="bg-black/90 text-white border-neutral-800">
            <div className="p-2">
              <h3 className="font-semibold">{mosque.name}</h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 hover:underline"
              >
                {mosque.address}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      <CenterMarker onPositionChange={handleCenterChange} />
      {lines.map((line, index) => (
        <Polyline
          key={`center-${index}`}
          positions={line as LatLngExpression[]}
          color="#22c55e"
          weight={2}
          opacity={0.4}
        />
      ))}
      <MapEvents
        onMosqueSelect={handleMosqueSelect}
        onNearestMosquesChange={handleNearestMosquesChange}
        lineCount={lineCount}
      />
    </MapContainer>
  )
}
