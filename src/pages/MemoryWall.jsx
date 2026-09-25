import { useState, useEffect, useCallback, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { supabase } from '../lib/supabase'

function createMemoryIcon(selected = false) {
  return L.divIcon({
    className: '',
    html: `<div style="width:40px;height:40px;background:${selected ? '#F4A93F' : '#173D32'};border:3px solid ${selected ? '#173D32' : '#F4A93F'};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:all 0.2s;cursor:pointer;"><span style="color:white;font-size:18px;">♥</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  })
}

function ClickHandler({ onClick }) {
  useMapEvents({ click(e) { onClick(e.latlng) } })
  return null
}

export default function MemoryWall() {
  const [memories, setMemories] = useState([])
  const [clickPos, setClickPos] = useState(null)
  const [memoryText, setMemoryText] = useState('')
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchMemories = useCallback(async () => {
    try {
      const { data } = await supabase.from('memories').select('*').eq('status', 'approved').order('created_at', { ascending: false })
      if (data) setMemories(data)
    } catch { }
    setLoading(false)
  }, [])

  useEffect(() => { fetchMemories() }, [fetchMemories])

  const handleMapClick = useCallback((latlng) => {
    setClickPos(latlng)
    setMemoryText('')
    setSelectedMemory(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!memoryText.trim()) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase.from('memories').insert({
        title: memoryText.trim().split('\n')[0].slice(0, 60),
        description: memoryText.trim(),
        submitted_by_name: 'Anonymous',
        latitude: clickPos.lat,
        longitude: clickPos.lng,
        status: 'pending',
      }).select()
      if (error) throw error
      if (data) {
        setMemories((prev) => [data[0], ...prev])
      }
      setClickPos(null)
      setMemoryText('')
    } catch (err) {
      console.error('Memory submit error:', err)
      alert('Failed to submit memory. Please try again.')
    }
    setSubmitting(false)
  }, [memoryText, clickPos])

  const handleLike = useCallback(async (id, currentLikes) => {
    try {
      await supabase.from('memories').update({ likes: currentLikes + 1 }).eq('id', id)
      setMemories((prev) => prev.map((m) => m.id === id ? { ...m, likes: m.likes + 1 } : m))
    } catch { }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading memories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-0">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-lg pointer-events-auto">
          <h2 className="font-bold text-navy text-sm sm:text-lg text-center">Memory Wall</h2>
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
        <ClickHandler onClick={handleMapClick} />

        {memories.map((m) => (
          <Marker
            key={m.id}
            position={[m.latitude, m.longitude]}
            icon={createMemoryIcon(selectedMemory?.id === m.id)}
            eventHandlers={{ click: () => setSelectedMemory(m) }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <p className="font-semibold text-navy text-sm mb-1">{m.title}</p>
                <p className="text-xs text-gray-500 mb-2">{m.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2">
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLike(m.id, m.likes) }}
                    className="flex items-center gap-0.5 text-status-error hover:text-status-error/80"
                  >
                    <span className="material-symbols-outlined text-base">favorite</span>
                    <span>{m.likes}</span>
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {clickPos && (
          <Marker position={[clickPos.lat, clickPos.lng]} icon={L.divIcon({
            className: '',
            html: `<div style="width:32px;height:32px;background:#F4A93F;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(244,169,63,0.5);animation:pulse 1.5s infinite;"><span style="color:#173D32;font-size:16px;font-weight:700;">+</span></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })} />
        )}

      </MapContainer>

      {clickPos && (
        <div className="absolute bottom-6 left-4 right-4 z-10 mx-auto" style={{ maxWidth: '28rem' }}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy text-sm">Drop a Memory</h3>
              <button onClick={() => setClickPos(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              <span className="material-symbols-outlined text-xs align-text-bottom">location_on</span>
              {clickPos.lat.toFixed(4)}, {clickPos.lng.toFixed(4)}
            </p>
            <textarea
              rows={3} placeholder="What happened here? Share your memory..."
              value={memoryText} onChange={(e) => setMemoryText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none mb-3"
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting || !memoryText.trim()}
                className="w-full py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Posting...' : 'Post Memory'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
