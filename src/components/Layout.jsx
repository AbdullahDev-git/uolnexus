import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopAppBar from './TopAppBar'
import Footer from './Footer'

const noFooterRoutes = ['/room-finder', '/memory-wall', '/cafes', '/libraries']

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const showFooter = !noFooterRoutes.some(route => location.pathname.startsWith(route))

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopAppBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 w-full flex flex-col min-h-0">
          <Outlet />
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}
