import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'admin@abdullah1822'

function AuthScreen({ onAuth }) {
  const [passcode, setPasscode] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      localStorage.setItem('admin_authenticated', 'true')
      onAuth()
    } else {
      alert('Incorrect passcode.')
    }
  }
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-sm w-full">
        <div className="text-center mb-6">
          <span className="material-symbols-outlined text-4xl text-navy mb-2">lock</span>
          <h1 className="text-xl font-bold text-navy">Admin Access</h1>
          <p className="text-sm text-gray-400 mt-1">Enter passcode to manage the platform</p>
        </div>
        <input
          type="password"
          placeholder="Enter passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold mb-4"
          autoFocus
        />
        <button type="submit" className="w-full py-2.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors">
          Access Admin Panel
        </button>
      </form>
    </div>
  )
}

function MemoriesTab() {
  const [allMemories, setAllMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    async function fetchAll() {
      try {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        setAllMemories(data || [])
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }
    fetchAll()
  }, [])

  const handleAction = async (id, newStatus) => {
    setActionLoading(id)
    try {
      await supabase.from('memories').update({ status: newStatus }).eq('id', id)
      setAllMemories((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m))
    } catch {
      alert('Failed to update memory.')
    }
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? allMemories : allMemories.filter((m) => m.status === filter)
  const counts = { pending: allMemories.filter((m) => m.status === 'pending').length, approved: allMemories.filter((m) => m.status === 'approved').length, rejected: allMemories.filter((m) => m.status === 'rejected').length }

  if (loading) return <div className="text-center py-20"><div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto" /></div>
  if (error) return <div className="text-center py-20 text-gray-500">Failed to load memories.</div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${filter === f ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {f} {counts[f] !== undefined && <span className="ml-1 opacity-60">({counts[f]})</span>}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">inbox</span>
          <p className="text-gray-400 text-sm">No {filter === 'all' ? '' : filter} memories</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const isRejected = m.status === 'rejected'
            const isApproved = m.status === 'approved'
            return (
              <div key={m.id} className={`rounded-2xl p-5 border transition-all ${isRejected ? 'bg-gray-50 border-gray-200 opacity-60' : isApproved ? 'bg-white border-gray-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className={`material-symbols-outlined mt-0.5 ${isRejected ? 'text-gray-300' : 'text-gray-400'}`}>location_on</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm ${isRejected ? 'text-gray-400' : 'text-navy'}`}>{m.title}</h3>
                      {isRejected && <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-semibold">Rejected</span>}
                      {isApproved && <span className="px-2 py-0.5 rounded-full bg-status-success/10 text-status-success text-[10px] font-semibold">Approved</span>}
                    </div>
                    <p className={`text-sm mt-1 ${isRejected ? 'text-gray-400' : 'text-gray-600'}`}>{m.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                      <span>By: {m.submitted_by_name}</span>
                      <span>{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {!isApproved && (
                  <div className="flex gap-2 ml-9">
                    <button onClick={() => handleAction(m.id, 'approved')} disabled={actionLoading === m.id}
                      className="px-4 py-1.5 rounded-xl bg-status-success text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                      {actionLoading === m.id ? '...' : 'Approve'}
                    </button>
                    <button onClick={() => handleAction(m.id, 'rejected')} disabled={actionLoading === m.id}
                      className="px-4 py-1.5 rounded-xl bg-status-error text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                      {actionLoading === m.id ? '...' : 'Reject'}
                    </button>
                  </div>
                )}
                {isApproved && (
                  <div className="flex gap-2 ml-9">
                    <button onClick={() => handleAction(m.id, 'rejected')} disabled={actionLoading === m.id}
                      className="px-4 py-1.5 rounded-xl bg-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-300 disabled:opacity-50 transition-opacity">
                      Move to Rejected
                    </button>
                  </div>
                )}
                {isRejected && (
                  <div className="flex gap-2 ml-9">
                    <button onClick={() => handleAction(m.id, 'approved')} disabled={actionLoading === m.id}
                      className="px-4 py-1.5 rounded-xl bg-status-success text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                      Approve
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      if (data) setMessages(data)
      setLoading(false)
    }
    fetchMessages()
  }, [])

  if (loading) return <div className="text-center py-20"><div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto" /></div>

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">mail</span>
          <p className="text-gray-400 text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-navy text-sm">{msg.name}</p>
                  <p className="text-xs text-gray-400">{msg.email}{msg.department ? ` · ${msg.department}` : ''}</p>
                </div>
                <span className="text-xs text-gray-300">{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminMemories() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('admin_authenticated') === 'true')
  const [tab, setTab] = useState(0)

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setAuthenticated(false)
  }

  if (!authenticated) return <AuthScreen onAuth={() => setAuthenticated(true)} />

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-navy">Admin Panel</h1>
          <div className="flex gap-2">
            <a href="/memory-wall" className="px-4 py-2 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors">
              Back to Site
            </a>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-200 transition-colors">
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl">
          {['Memories', 'Messages'].map((label, i) => (
            <button key={label} onClick={() => setTab(i)}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === i ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 0 ? <MemoriesTab /> : <MessagesTab />}
      </div>
    </div>
  )
}
