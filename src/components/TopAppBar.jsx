export default function TopAppBar({ onMenuToggle, onSidebarToggle, sidebarCollapsed }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            className="p-2 -ml-2 rounded-xl text-[#173D32] hover:bg-gray-100 transition-colors lg:flex hidden"
            onClick={onSidebarToggle}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-2xl">
              {sidebarCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
          <button
            className="p-2 -ml-2 rounded-xl text-[#173D32] hover:bg-gray-100 transition-colors flex lg:hidden"
            onClick={onMenuToggle}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </div>
    </header>
  )
}
