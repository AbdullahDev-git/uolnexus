import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { supabase } from '../lib/supabase'

function createCafeIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:38px;height:38px;background:#10B981;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(16,185,129,0.4);"><span style="color:white;font-size:18px;">&#9749;</span></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  })
}

export default function Cafes() {
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCafes() {
      try {
        const { data, error } = await supabase.from('cafes').select('*').order('name')
        if (error) throw error
        setCafes(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCafes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading cafes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] px-6">
        <div className="text-center max-w-sm">
          <span className="material-symbols-outlined text-5xl text-status-error mb-3">error</span>
          <p className="text-sm text-gray-500">Unable to load cafes. Please check your connection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-0">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-lg pointer-events-auto">
          <h2 className="font-bold text-navy text-sm sm:text-lg text-center">Cafes &amp; Food Spots</h2>
        </div>
      </div>

      <MapContainer
        center={[31.390722, 74.2410]}
        zoom={16}
        minZoom={15}
        maxZoom={22}
        maxBounds={[[31.3875, 74.2385], [31.3945, 74.2455]]}
        maxBoundsViscosity={1}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />

        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={[cafe.latitude, cafe.longitude]}
            icon={createCafeIcon()}
          >
            <Popup>
              <div className="text-center min-w-[140px]">
                <p className="font-semibold text-navy text-sm">{cafe.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
