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

export default function TopAppBar({ onSidebarToggle, sidebarCollapsed }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            className="p-2 -ml-2 rounded-xl text-[#173D32] hover:bg-gray-100 transition-colors hidden lg:flex"
            onClick={onSidebarToggle}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-2xl">
              {sidebarCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
          <NavLink to="/home" className="flex items-center gap-3 min-w-0 lg:hidden">
            <img src="/logo.png" alt="UOL" className="w-8 h-8 object-contain shrink-0" />
            <span className="font-bold text-[#173D32] text-sm leading-tight block truncate">UOL Nexus</span>
          </NavLink>
        </div>
      </div>
      <nav className="flex lg:hidden items-center gap-1 px-3 pb-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-[#173D32] text-white shadow-sm [&_span]:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#173D32]'
              }`
            }
          >
            <span className="material-symbols-outlined text-base shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
