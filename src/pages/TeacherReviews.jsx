import { Link } from 'react-router-dom'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getPhotoUrl } from '../lib/utils'

function StarRating({ rating, size = 'text-sm' }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${size} ${i <= Math.floor(rating) ? 'text-gold' : 'text-gray-200'}`}
          style={{ fontVariationSettings: `'FILL' ${i <= Math.floor(rating) ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </div>
  )
}

export default function TeacherReviews() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [desigFilter, setDesigFilter] = useState('')
  const [teachers, setTeachers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayCount, setDisplayCount] = useState(80)
  const PAGE_SIZE = 80

  useEffect(() => {
    async function fetchData() {
      try {
        const [tRes, dRes] = await Promise.all([
          supabase.from('teachers').select('*, departments(name)').order('name'),
          supabase.from('departments').select('*').order('name'),
        ])
        if (tRes.error) throw tRes.error
        if (dRes.error) throw dRes.error
        setTeachers(tRes.data)
        setDepartments(dRes.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const [ratings, setRatings] = useState({})

  useEffect(() => {
    fetchRatings()
  }, [teachers])

  useEffect(() => {
    const channel = supabase
      .channel('teacher-reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teacher_reviews' }, () => {
        fetchRatings()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchRatings() {
    if (teachers.length === 0) return
    const ids = teachers.map((t) => t.id)
    const { data, error } = await supabase
      .from('teacher_reviews')
      .select('teacher_id, rating')
      .in('teacher_id', ids)
    if (error) return
    const map = {}
    for (const row of data) {
      if (!map[row.teacher_id]) map[row.teacher_id] = { sum: 0, count: 0 }
      map[row.teacher_id].sum += row.rating
      map[row.teacher_id].count += 1
    }
    const result = {}
    for (const [id, v] of Object.entries(map)) {
      result[id] = { avg: +(v.sum / v.count).toFixed(1), count: v.count }
    }
    setRatings(result)
  }

  const deptOptions = [...new Map(teachers.map((t) => [t.departments?.name, t.departments])).keys()].filter(Boolean).sort()

  const desigOptions = useMemo(() => {
    const pool = deptFilter ? teachers.filter((t) => t.departments?.name === deptFilter) : teachers
    return [...new Set(pool.map((t) => t.designation))].sort()
  }, [deptFilter, teachers])

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const matchName = t.name.toLowerCase().includes(search.toLowerCase())
      const deptName = t.departments?.name || ''
      const matchDept = !deptFilter || deptName === deptFilter
      const matchDesig = !desigFilter || t.designation === desigFilter
      return matchName && matchDept && matchDesig
    })
  }, [search, deptFilter, desigFilter, teachers])

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [search, deptFilter, desigFilter])

  useEffect(() => {
    if (deptFilter && !desigOptions.includes(desigFilter)) {
      setDesigFilter('')
    }
  }, [deptFilter, desigOptions])

  const visible = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount])
  const hasMore = displayCount < filtered.length

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading teachers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-status-error mb-3">error</span>
          <p className="text-sm text-gray-500">Unable to load teacher data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-1">Teacher Reviews</h1>
        <p className="text-gray-500">Student-powered feedback to help you choose the right instructors.</p>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
        >
          <option value="">All Departments</option>
          {deptOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={desigFilter}
          onChange={(e) => setDesigFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
        >
          <option value="">All Designations</option>
          {desigOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">search_off</span>
          <p className="text-gray-400 text-sm">No teachers match your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            Showing {displayCount > filtered.length ? filtered.length : displayCount} of {filtered.length} teacher{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t) => {
            const rating = ratings[t.id]
            return (
              <Link
                key={t.id}
                to={`/teacher-reviews/${t.id}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-navy/10 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shrink-0 shadow-md relative overflow-hidden">
                    <span className="text-white font-bold text-sm">
                      {t.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                    {t.photo_url && (
                      <img
                        src={getPhotoUrl(t.photo_url)}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-navy truncate">{t.name}</h3>
                    <p className="text-xs text-gray-400 mb-1">{t.departments?.name || ''}</p>
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-gold/10 text-gold-dark text-xs font-semibold">
                      {t.designation}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  {rating ? (
                    <>
                      <StarRating rating={rating.avg} />
                      <span className="text-sm font-bold text-navy">{rating.avg}</span>
                      <span className="text-xs text-gray-400">({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">No reviews yet</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="px-8 py-3 rounded-2xl bg-navy text-white font-semibold text-sm hover:bg-navy/90 transition-colors shadow-sm"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { StarRating }
