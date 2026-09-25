import { useState } from 'react'
import { supabase } from '../lib/supabase'
import emailjs from '@emailjs/browser'

const faqs = [
  { q: 'How accurate is the Room Finder?', a: 'Our Room Finder is updated every semester based on the official UOL registrar\'s database, ensuring over 98% accuracy for all academic blocks and specialized labs.' },
  { q: 'Is the GPA Calculator based on UOL policy?', a: 'Yes, the calculator uses the standard 4.0 scale specifically configured with University of Lahore\'s grade-to-point weighting system.' },
  { q: 'Who can contribute to the Memory Wall?', a: 'Any registered student or faculty member can upload memories. All content is moderated to ensure it aligns with university values.' },
  { q: 'How do I submit a teacher review?', a: 'Navigate to the Teacher Reviews page, select your instructor, and fill out the review form. All reviews are verified for authenticity.' },
]

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#173D32] pr-4">{q}</span>
        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    
    setSubmitting(true)
    try {
      // Save to Supabase (optional, for record keeping)
      await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })

      // Send email via EmailJS
      console.log('Sending email with:', {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        params: { from_name: form.name, from_email: form.email, message: form.message, to_email: 'infouolnexus@gmail.com' }
      })
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: 'infouolnexus@gmail.com',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      console.log('EmailJS result:', result)
    } catch (err) {
      console.error('Email send error:', err)
      alert(`Failed to send: ${err?.text || err?.message || 'Unknown error'}`)
      setSubmitting(false)
      return
    }
    
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setSubmitting(false)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div>
      <section className="relative h-[50vh] min-h-[350px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/about.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#173D32]/90 via-[#173D32]/75 to-[#173D32]/50" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-gold text-xs font-medium rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              Contact
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Get in Touch</h1>
            <p className="text-gray-200 max-w-lg">We'd love to hear from you. Send us a message.</p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@uol.edu.pk"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Message</label>
            <textarea
              rows={5}
              placeholder="Write your message here..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-2.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto mt-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-navy">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500">Quick answers to common questions.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <Accordion key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}
