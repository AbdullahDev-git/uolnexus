import { Link } from 'react-router-dom'

const features = [
  { icon: 'map', title: 'Room Finder', desc: 'Instant directions to any classroom or lab across campus.', link: '/room-finder', color: 'text-[#173D32]', badge: 'Under Development' },
  { icon: 'calculate', title: 'GPA Calculator', desc: 'Track and project your academic standing per semester.', link: '/gpa-calculator', color: 'text-gold' },
  { icon: 'star', title: 'Teachers Review', desc: 'Student-powered feedback on faculty and courses.', link: '/teacher-reviews', color: 'text-[#173D32]' },
  { icon: 'photo', title: 'Memory Wall', desc: 'Share and explore campus memories on an interactive map.', link: '/memory-wall', color: 'text-gold' },
]

const samples = [
  { room: 'CS Lab 1', building: 'Engineering Block' },
  { room: 'Room 302', building: 'Business School' },
  { room: 'Pharmacy Lab 2', building: 'Science Complex' },
]

const testimonials = [
  { name: 'Ahmed Khan', dept: 'Computer Science', initial: 'AK', text: '"The Room Finder saved me so much time during my first week. I never realized how large the Engineering Block actually was until I used the app."' },
  { name: 'Sara Malik', dept: 'Pharmacy', initial: 'SM', text: '"The GPA calculator is my go-to for planning my semester. It\'s accurate and helps me stay focused on my academic goals."' },
  { name: 'Zainab Ali', dept: 'Business Administration', initial: 'ZA', text: '"The Teachers Review section helped me pick the best elective courses. It\'s great to have a voice that future students can hear."' },
]

export default function Home() {
  return (
    <div>
      <section className="relative h-[70vh] min-h-[400px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/main.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#173D32]/95 via-[#173D32]/80 to-[#173D32]/60" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gold blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gold blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/15 text-gold text-sm font-medium rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              Digital Campus Companion
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Navigate Your Academic Journey at UOL
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-8 leading-relaxed">
              A centralized portal to find rooms, calculate grades, review faculty, and share campus memories — built for the modern University of Lahore experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#tools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-[#173D32] font-semibold rounded-2xl hover:bg-gold-dark transition-all shadow-lg shadow-gold/25"
              >
                Explore Features
            <span className="material-symbols-outlined text-white">arrow_forward</span>
              </a>
              <Link
                to="/memory-wall"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#173D32] font-semibold rounded-2xl border border-white/30 hover:bg-gray-50 transition-all shadow-lg"
              >
                Campus Map
                <span className="material-symbols-outlined">map</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="max-w-7xl mx-auto px-6 mt-16 mb-14 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#173D32] mb-2">Tools Designed for Success</h2>
          <p className="text-gray-500">Everything you need to navigate UOL smoothly.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-[#173D32]/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-[#173D32]/5 transition-colors">
                <span className={`material-symbols-outlined text-3xl ${f.color}`}>{f.icon}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-[#173D32]">{f.title}</h3>
                {f.badge && <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark text-[10px] font-semibold whitespace-nowrap">{f.badge}</span>}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5 bg-navy rounded-xl px-5 py-3">
            <span className="material-symbols-outlined text-white text-3xl">map</span>
            <div>
              <h2 className="text-xl font-bold text-white">Room Finder Preview</h2>
              <p className="text-xs text-white/70">Explore rooms across campus</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {samples.map((s) => (
              <div key={s.room} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-semibold text-navy text-sm">{s.room}</span>
                <span className="text-xs text-gray-500">{s.building}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#173D32] mb-2">Student Experiences</h2>
            <p className="text-gray-500">Hear from your fellow students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="material-symbols-outlined text-gold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed mb-5 flex-1">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#173D32] flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-sm">{t.initial}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#173D32] text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-4xl text-navy mb-3">support_agent</span>
          <h2 className="text-2xl font-bold text-navy mb-2">Need Help?</h2>
          <p className="text-gray-500 mb-6">Facing any issues? Get in touch with the UOL Nexus team.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-2xl hover:bg-navy-light transition-all shadow-sm">
            Contact Us
            <span className="material-symbols-outlined text-white">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
