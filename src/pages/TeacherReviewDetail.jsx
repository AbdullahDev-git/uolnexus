import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getPhotoUrl } from '../lib/utils'
import { StarRating } from './TeacherReviews'

export default function TeacherReviewDetail() {
  const { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [tRes, rRes] = await Promise.all([
          supabase.from('teachers').select('*, departments(name)').eq('id', id).single(),
          supabase.from('teacher_reviews').select('*').eq('teacher_id', id).order('created_at', { ascending: false }),
        ])
        if (tRes.error) throw tRes.error
        if (rRes.error) throw rRes.error
        setTeacher(tRes.data)
        setReviews(rRes.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const [vote, setVote] = useState(null)
  const [reviewerName] = useState(() => 'Visitor-' + Math.random().toString(36).slice(2, 6))

  const handleVote = useCallback(async (type) => {
    if (!teacher) return
    const field = type === 'up' ? 'upvotes' : 'downvotes'
    const delta = vote === type ? -1 : (vote ? 0 : 1)
    const newVal = Math.max(0, teacher[field === 'upvotes' ? 'upvotes' : 'downvotes'] + delta)
    setTeacher((prev) => ({ ...prev, [field]: newVal }))
    setVote((prev) => (prev === type ? null : type))
    try {
      await supabase.from('teachers').update({ [field]: newVal }).eq('id', id)
    } catch { }
  }, [teacher, vote, id])

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!reviewForm.text.trim()) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('teacher_reviews')
        .insert({
          teacher_id: id,
          reviewer_name: 'Anonymous',
          rating: reviewForm.rating,
          review_text: reviewForm.text.trim(),
        })
        .select()
        .single()
      if (error) throw error
      setReviews((prev) => [data, ...prev])
      setReviewForm({ rating: 5, text: '' })
      setShowReviewForm(false)
    } catch (err) {
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [reviewForm, id])

  const handleReport = useCallback(async (reviewId) => {
    try {
      await supabase.from('teacher_reviews').update({ is_reported: true }).eq('id', reviewId)
      setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, is_reported: true } : r))
    } catch { }
  }, [])

  const [likes, setLikes] = useState({})
  const [liking, setLiking] = useState({})

  const handleLike = useCallback(async (reviewId, type) => {
    if (liking[reviewId]) return
    setLiking((prev) => ({ ...prev, [reviewId]: true }))
    const current = likes[reviewId]
    try {
      if (current === type) {
        await supabase.from('review_reactions').delete().eq('review_id', reviewId).eq('reviewer_name', reviewerName).eq('reaction_type', type)
        setLikes((prev) => { const { [reviewId]: _, ...rest } = prev; return rest })
      } else {
        if (current) {
          await supabase.from('review_reactions').delete().eq('review_id', reviewId).eq('reviewer_name', reviewerName).eq('reaction_type', current)
        }
        await supabase.from('review_reactions').insert({ review_id: reviewId, reviewer_name: reviewerName, reaction_type: type })
        setLikes((prev) => ({ ...prev, [reviewId]: type }))
      }
    } catch { }
    setLiking((prev) => ({ ...prev, [reviewId]: false }))
  }, [likes, reviewerName, liking])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading teacher...</p>
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-navy mb-2">Teacher Not Found</h2>
        <Link to="/teacher-reviews" className="text-gold-dark font-semibold hover:underline">Back to Reviews</Link>
      </div>
    )
  }

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) : 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link to="/teacher-reviews" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy mb-6 transition-colors">
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Reviews
      </Link>

      <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shrink-0 shadow-md relative overflow-hidden">
            <span className="text-white font-bold text-xl">{teacher.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
            {teacher.photo_url && (
              <img src={getPhotoUrl(teacher.photo_url)} alt="" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover cursor-pointer" onClick={() => window.open(getPhotoUrl(teacher.photo_url), '_blank')} onError={(e) => { e.target.style.display = 'none' }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-navy">{teacher.name}</h1>
            <p className="text-sm text-gray-400 mb-1">{teacher.departments?.name || ''}</p>
            <span className="inline-block px-3 py-0.5 rounded-lg bg-gold/10 text-gold-dark text-xs font-semibold mb-3">{teacher.designation}</span>
            <div className="flex items-center gap-3">
              <StarRating rating={avgRating} />
              <span className="text-lg font-bold text-navy">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                vote === 'up' ? 'bg-status-success/10 text-status-success border border-status-success/20' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-lg">thumb_up</span>
              {teacher.upvotes || 0}
            </button>
            <button
              onClick={() => handleVote('down')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                vote === 'down' ? 'bg-status-error/10 text-status-error border border-status-error/20' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-lg">thumb_down</span>
              {teacher.downvotes || 0}
            </button>
          </div>
        </div>
        {teacher.bio && <p className="text-sm text-gray-600 leading-relaxed">{teacher.bio}</p>}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-navy">Student Reviews ({totalReviews})</h2>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors"
        >
          <span className="material-symbols-outlined text-lg">rate_review</span>
          Write a Review
        </button>
      </div>

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
          <h3 className="font-semibold text-navy mb-4">Write Your Review</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                  <span className={`material-symbols-outlined text-3xl ${star <= reviewForm.rating ? 'text-gold' : 'text-gray-200'}`} style={{ fontVariationSettings: `'FILL' ${star <= reviewForm.rating ? 1 : 0}` }}>
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={3}
            placeholder="Share your experience with this teacher..."
            value={reviewForm.text}
            onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none mb-4"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-light disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowReviewForm(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 && !showReviewForm && (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">rate_review</span>
            <p className="text-sm text-gray-400">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-xs">{r.reviewer_name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">{r.reviewer_name}</p>
                  <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`material-symbols-outlined text-sm ${i <= r.rating ? 'text-gold' : 'text-gray-200'}`} style={{ fontVariationSettings: `'FILL' ${i <= r.rating ? 1 : 0}` }}>star</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.review_text}</p>
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleLike(r.id, 'like')}
                className={`flex items-center gap-1 transition-colors ${likes[r.id] === 'like' ? 'text-navy' : 'text-gray-400 hover:text-navy'}`}
              >
                <span className="material-symbols-outlined text-lg">{likes[r.id] === 'like' ? 'thumb_up' : 'thumb_up_off_alt'}</span>
                {r.upvotes + (likes[r.id] === 'like' ? 1 : 0)}
              </button>
              <button
                onClick={() => handleLike(r.id, 'dislike')}
                className={`flex items-center gap-1 transition-colors ${likes[r.id] === 'dislike' ? 'text-status-error' : 'text-gray-400 hover:text-status-error'}`}
              >
                <span className="material-symbols-outlined text-lg">{likes[r.id] === 'dislike' ? 'thumb_down' : 'thumb_down_off_alt'}</span>
                {r.downvotes + (likes[r.id] === 'dislike' ? 1 : 0)}
              </button>
              {!r.is_reported ? (
                <button onClick={() => handleReport(r.id)} className="flex items-center gap-1 text-gray-400 hover:text-status-error transition-colors ml-auto">
                  <span className="material-symbols-outlined text-lg">flag</span>
                  <span className="text-xs">Report</span>
                </button>
              ) : (
                <span className="flex items-center gap-1 text-gray-300 ml-auto text-xs">
                  <span className="material-symbols-outlined text-lg">flag</span>
                  Reported
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
