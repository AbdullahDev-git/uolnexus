import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/home', icon: 'home', label: 'Home' },
  { to: '/room-finder', icon: 'map', label: 'Room Finder' },
  { to: '/cafes', icon: 'local_cafe', label: 'Cafes' },
  { to: '/libraries', icon: 'local_library', label: 'Libraries' },
  { to: '/gpa-calculator', icon: 'calculate', label: 'GPA Calculator' },
  { to: '/teacher-reviews', icon: 'star', label: 'Teachers Review' },
  { to: '/memory-wall', icon: 'photo', label: 'Memory Wall' },
  { to: '/about', icon: 'info', label: 'About' },
  { to: '/contact', icon: 'mail', label: 'Contact' },
]

export default function Sidebar({ collapsed }) {
  const content = (
    <div className="flex flex-col h-full">
      <div className={`p-4 border-b border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        <NavLink to="/home" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="UOL"
            className="w-9 h-9 object-contain shrink-0"
            onError={(e) => {
              e.target.style.display = 'none'
              const fb = document.createElement('div')
              fb.className = 'w-9 h-9 rounded-xl bg-[#173D32] flex items-center justify-center shrink-0'
              fb.innerHTML = '<span style="color:white;font-weight:700;font-size:16px">U</span>'
              e.target.parentNode.insertBefore(fb, e.target)
            }}
          />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-bold text-[#173D32] text-sm leading-tight block truncate">UOL Nexus</span>
              <span className="text-[10px] text-gray-400 leading-tight block truncate">University of Lahore</span>
            </div>
          )}
        </NavLink>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl text-sm font-medium transition-all ${
                collapsed ? 'justify-center px-0 py-2.5' : 'px-4 py-2.5'
              } ${
                  isActive
                    ? 'bg-[#173D32] text-white shadow-md [&_span]:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#173D32]'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 border-t border-gray-100 ${collapsed ? 'text-center' : ''}`}>
        <p className="text-[10px] text-gray-400">{collapsed ? '©' : '© 2026 UOL Nexus'}</p>
      </div>
    </div>
  )

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-gray-200 shadow-sm shrink-0 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {content}
    </aside>
  )
}
