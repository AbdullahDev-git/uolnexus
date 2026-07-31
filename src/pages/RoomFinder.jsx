import { useState, useMemo, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { supabase } from '../lib/supabase'

const gate2Pos = [31.389868442049437, 74.24039647420663]

const campusSpine = [
  [31.38987, 74.24040],
  [31.39015, 74.24050],
  [31.39040, 74.24063],
  [31.39065, 74.24078],
  [31.39088, 74.24093],
  [31.39110, 74.24112],
  [31.39132, 74.24132],
  [31.39155, 74.24153],
  [31.39178, 74.24175],
  [31.39200, 74.24195],
  [31.39215, 74.24208],
]

function getInternalRoute(bLat, bLng) {
  let bestIdx = 0, bestDist = Infinity
  for (let i = 0; i < campusSpine.length; i++) {
    const d = Math.hypot(campusSpine[i][0] - bLat, campusSpine[i][1] - bLng)
    if (d < bestDist) { bestDist = d; bestIdx = i }
  }
  return [...campusSpine.slice(0, bestIdx + 1), [bLat, bLng]]
}

function createNavyIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;background:#173D32;border:3px solid #F4A93F;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(23,61,50,0.3);"><span style="color:white;font-size:16px;font-weight:700;">U</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

function createGoldIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:44px;height:44px;background:#F4A93F;border:3px solid #173D32;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(244,169,63,0.4);animation:pulse 1.5s infinite;"><span style="color:#173D32;font-size:20px;font-weight:700;">★</span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  })
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(3)
}

export default function RoomFinder() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [routeCoords, setRouteCoords] = useState(null)
  const [routeDistance, setRouteDistance] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [bRes, rRes, dRes] = await Promise.all([
          supabase.from('buildings').select('*').order('name'),
          supabase.from('rooms').select('*').order('room_number'),
          supabase.from('departments').select('*').order('name'),
        ])
        if (bRes.error) throw bRes.error
        if (rRes.error) throw rRes.error
        if (dRes.error) throw dRes.error
        setBuildings(bRes.data)
        setRooms(rRes.data)
        setDepartments(dRes.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!selected) { setRouteCoords(null); setRouteDistance(null); return }
    const coords = getInternalRoute(selected.latitude, selected.longitude)
    setRouteCoords(coords)
    let dist = 0
    for (let i = 1; i < coords.length; i++) {
      dist += Number(haversineKm(coords[i-1][0], coords[i-1][1], coords[i][0], coords[i][1]))
    }
    setRouteDistance(dist.toFixed(3))
  }, [selected])

  const filtered = useMemo(() => {
    if (!search.trim()) return buildings
    const q = search.toLowerCase()
    return buildings.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.department_category.toLowerCase().includes(q) ||
      departments.some((d) => d.building_id === b.id && d.name.toLowerCase().includes(q)) ||
      rooms.some((r) => r.building_id === b.id && r.room_number.toLowerCase().includes(q))
    )
  }, [search, buildings, departments, rooms])

  const matchedRooms = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return rooms.filter((r) => r.room_number.toLowerCase().includes(q))
  }, [search, rooms])

  const handleSelect = useCallback((b, room) => {
    setSelected(b)
    setSelectedRoom(room || null)
    setShowDetail(true)
    setSearch('')
  }, [])

  const distance = routeDistance || (selected ? haversineKm(gate2Pos[0], gate2Pos[1], selected.latitude, selected.longitude) : '0')
  const buildingRooms = selected ? rooms.filter((r) => r.building_id === selected.id) : []
  const buildingDepts = selected ? departments.filter((d) => d.building_id === selected.id) : []
  const roomBuilding = selectedRoom ? buildings.find((b) => b.id === selectedRoom.building_id) : null
  const roomDept = selectedRoom && selectedRoom.department_id ? departments.find((d) => d.id === selectedRoom.department_id) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading campus map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] px-6">
        <div className="text-center max-w-sm">
          <span className="material-symbols-outlined text-5xl text-status-error mb-3">error</span>
          <p className="text-sm text-gray-500">Unable to load campus data. Please check your connection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-5xl text-navy mb-3 block">construction</span>
          <h2 className="text-2xl font-bold text-navy mb-1">Coming Soon</h2>
          <p className="text-sm text-gray-500">This feature will be available soon.</p>
        </div>
      </div>
      <div className="h-full min-h-0 flex flex-col lg:flex-row">
      <div className="w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col shrink-0 lg:max-h-none max-h-[40vh] min-h-0">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xl">search</span>
            <input
              type="text"
              placeholder="Search buildings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {matchedRooms.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-1 mb-2">Rooms</p>
              {matchedRooms.map((r) => {
                const b = buildings.find((x) => x.id === r.building_id)
                return (
                  <button
                    key={r.id}
                    onClick={() => b && handleSelect(b, r)}
                    className="w-full text-left p-3 rounded-2xl transition-all border-2 border-gray-100 bg-white hover:border-navy/20 hover:shadow-sm mb-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-navy">{r.room_number}</p>
                        <p className="text-xs text-gray-400">
                          {r.room_type} · Floor {r.floor} · {b?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-gray-300 text-lg">meeting_room</span>
                    </div>
                  </button>
                )
              })}
              {filtered.length > 0 && <div className="border-t border-gray-100 my-2" />}
            </div>
          )}
          {filtered.length === 0 && matchedRooms.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No buildings found.</p>
          ) : (
            filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelect(b, null)}
                className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                  selected?.id === b.id && !selectedRoom
                    ? 'bg-navy text-white border-navy shadow-md'
                    : 'bg-white text-gray-700 border-gray-100 hover:border-navy/20 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-semibold text-sm">{b.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${selected?.id === b.id && !selectedRoom ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-500'}`}>
                    {b.code}
                  </span>
                </div>
                <p className={`text-xs ${selected?.id === b.id && !selectedRoom ? 'text-white/70' : 'text-gray-400'}`}>{b.department_category}</p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {buildings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No building data available.</div>
        ) : (
          <MapContainer
            center={[31.3902, 74.2410]}
            zoom={17}
            minZoom={15}
            maxZoom={20}
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
            {selected && routeCoords && (
              <Polyline
                positions={routeCoords}
                pathOptions={{ color: '#F4A93F', weight: 4, opacity: 0.8 }}
              />
            )}
            {selected && !routeCoords && (
              <Polyline
                positions={[gate2Pos, [selected.latitude, selected.longitude]]}
                pathOptions={{ color: '#F4A93F', weight: 3, dashArray: '10, 8', opacity: 0.8 }}
              />
            )}
            {buildings.map((b) => (
              <Marker
                key={b.id}
                position={[b.latitude, b.longitude]}
                icon={selected?.id === b.id ? createGoldIcon() : createNavyIcon()}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-bold text-navy text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.department_category}</p>
                    <p className="text-xs text-gray-400 mt-1">Code: {b.code}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            <Marker position={gate2Pos} icon={L.divIcon({
              className: '',
              html: `<div style="background:#EF4444;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);">GATE 2</div>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            })}>
              <Popup>Gate 2 — Main Entrance</Popup>
            </Marker>
          </MapContainer>
        )}

        {selected && showDetail && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="relative">
                {selected.photo_url ? (
                  <div className="h-40">
                    <img src={selected.photo_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-r from-navy to-navy-light flex items-center px-5">
                    <h3 className="text-white font-bold text-lg">{selected.name}</h3>
                  </div>
                )}
                <button
                  onClick={() => { setShowDetail(false); setSelectedRoom(null) }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <span className="material-symbols-outlined text-navy text-lg">close</span>
                </button>
                {selected.photo_url && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-bold">{selected.name}</h3>
                    <p className="text-white/80 text-sm">{selected.department_category}</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                {selectedRoom && roomBuilding && (
                  <div className="mb-4 p-3 rounded-xl bg-gold/5 border border-gold/20">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Selected Room</p>
                    <p className="font-bold text-navy text-sm">{selectedRoom.room_number}</p>
                    <p className="text-xs text-gray-500">
                      {selectedRoom.room_type} · Floor {selectedRoom.floor}
                    </p>
                    {roomDept ? <p className="text-xs text-gray-500">{roomDept.name}</p> : <p className="text-xs text-gray-500">Shared / Common Room</p>}
                    <p className="text-xs text-gray-400 mt-1">Building: {roomBuilding.name}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gold text-lg">near_me</span>
                    <span className="text-sm font-medium text-navy">{distance} km</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-400 text-lg">meeting_room</span>
                    <span className="text-sm text-gray-600">{buildingRooms.length} rooms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-400 text-lg">badge</span>
                    <span className="text-sm text-gray-600">{selected.code}</span>
                  </div>
                </div>
                {buildingDepts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Departments</p>
                    <div className="flex flex-wrap gap-1.5">
                      {buildingDepts.map((d) => (
                        <span key={d.id} className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium">{d.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Rooms & Labs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {buildingRooms.length === 0 ? (
                      <span className="text-xs text-gray-400">No rooms listed</span>
                    ) : (
                      buildingRooms.map((r) => (
                        <span key={r.id} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${selectedRoom?.id === r.id ? 'bg-navy text-white' : 'bg-gray-50 text-gray-600'}`}>
                          {r.room_number}
                          {r.room_type !== 'classroom' && <span className="text-[10px] ml-1 opacity-70">({r.room_type})</span>}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
