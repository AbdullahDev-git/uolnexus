import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { usePageTracking } from './lib/ga4'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import RoomFinder from './pages/RoomFinder'
import Cafes from './pages/Cafes'
import Libraries from './pages/Libraries'
import GPACalculator from './pages/GPACalculator'
import TeacherReviews from './pages/TeacherReviews'
import TeacherReviewDetail from './pages/TeacherReviewDetail'
import MemoryWall from './pages/MemoryWall'
import AdminMemories from './pages/AdminMemories'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'

function PageTracker() {
  usePageTracking()
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/room-finder" element={<RoomFinder />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/libraries" element={<Libraries />} />
          <Route path="/gpa-calculator" element={<GPACalculator />} />
          <Route path="/teacher-reviews" element={<TeacherReviews />} />
          <Route path="/teacher-reviews/:id" element={<TeacherReviewDetail />} />
          <Route path="/memory-wall" element={<MemoryWall />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/admin/memories" element={<AdminMemories />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
