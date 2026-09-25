import { Link } from 'react-router-dom'

const particles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 5 + 2,
  delay: Math.random() * 6,
  duration: Math.random() * 5 + 3,
}))

export default function Welcome() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center px-6 overflow-hidden" style={{ backgroundImage: "url('/front.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#173D32]/95 via-[#173D32]/70 to-black/40"></div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-[1]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#173D32]/40"
            style={{
              left: p.left,
              top: p.top,
              width: p.size + 'px',
              height: p.size + 'px',
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="mb-8">
          <img
            src="/logo_new.png"
            alt="University of Lahore"
            className="w-32 h-32 object-contain mx-auto mb-5"
            onError={(e) => {
              const fallback = document.createElement('div')
              fallback.className = 'w-20 h-20 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-5'
              fallback.innerHTML = '<span style="color:#173D32;font-weight:700;font-size:28px">U</span>'
              e.target.parentNode.replaceChild(fallback, e.target)
            }}
          />
          <h1 className="text-4xl font-bold text-white mb-1">UOL Nexus</h1>
          <p className="text-gold font-medium text-sm">University of Lahore</p>
        </div>

        <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Your all-in-one campus companion. Find rooms, calculate GPA, review faculty, and share memories.
        </p>

        <Link
          to="/home"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-[#173D32] font-bold rounded-2xl hover:bg-gold-dark transition-all shadow-lg shadow-gold/25 text-base"
        >
          Get Started
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>

        <div className="mt-12 flex items-center justify-center gap-6 text-white/30 text-xs">
          <span>Room Finder</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>GPA Calculator</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>Teacher Reviews</span>
        </div>
      </div>
    </div>
  )
}
