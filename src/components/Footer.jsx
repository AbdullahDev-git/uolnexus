import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative text-white mt-auto overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/footer.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-[#173D32]/95" />
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/home" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="UOL" className="w-9 h-9 object-contain shrink-0" />
              <div>
                <span className="font-bold text-white text-base leading-tight block">UOL Nexus</span>
                <span className="text-xs text-gray-400">University of Lahore</span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed mb-5">
              Dedicated to providing an exceptional campus experience through digital innovation and academic excellence.
            </p>
            <div className="flex gap-3">
              <Link to="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-gold hover:text-navy transition-all">
                <span className="material-symbols-outlined text-lg">public</span>
              </Link>
              <Link to="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-gold hover:text-navy transition-all">
                <span className="material-symbols-outlined text-lg">mail</span>
              </Link>
              <Link to="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-gold hover:text-navy transition-all">
                <span className="material-symbols-outlined text-lg">smartphone</span>
              </Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gold text-sm uppercase tracking-wider mb-4">Campus Tools</p>
            <ul className="space-y-3 text-sm">
              <li><Link to="/room-finder" className="text-gray-300 hover:text-gold transition-colors">Room Finder</Link></li>
              <li><Link to="/gpa-calculator" className="text-gray-300 hover:text-gold transition-colors">GPA Calculator</Link></li>
              <li><Link to="/teacher-reviews" className="text-gray-300 hover:text-gold transition-colors">Teacher Reviews</Link></li>
              <li><Link to="/memory-wall" className="text-gray-300 hover:text-gold transition-colors">Memory Wall</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gold text-sm uppercase tracking-wider mb-4">Contact Info</p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/contact" className="inline-flex items-center gap-2 text-gray-300 hover:text-gold transition-colors">
                  <span className="material-symbols-outlined text-gold text-base">send</span>
                  Send us a message
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold text-base">mail</span>
                <a href="mailto:infouolnexus@gmail.com" className="hover:text-gold transition-colors">infouolnexus@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 UOL Nexus. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link to="#" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
