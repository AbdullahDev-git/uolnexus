import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

function GPATab({ gradeScale }) {
  const [courses, setCourses] = useState([{ name: '', credits: 3, grade: 'A' }])

  const gradePoints = useMemo(() => {
    const map = {}
    for (const g of gradeScale) {
      map[g.grade_letter] = g.grade_points
    }
    return map
  }, [gradeScale])

  const addCourse = () => setCourses([...courses, { name: '', credits: 3, grade: 'A' }])
  const updateCourse = (i, field, value) => {
    const updated = [...courses]
    updated[i] = { ...updated[i], [field]: value }
    setCourses(updated)
  }
  const removeCourse = (i) => {
    if (courses.length > 1) setCourses(courses.filter((_, idx) => idx !== i))
  }

  const totalCredits = courses.reduce((sum, c) => sum + Number(c.credits), 0)
  const weightedSum = courses.reduce((sum, c) => {
    const points = gradePoints[c.grade] || 0
    return sum + points * Number(c.credits)
  }, 0)
  const gpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Course</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white w-28">Credit Hrs</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white w-32">Grade</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-2.5">
                    <input
                      type="text" placeholder="Course name" value={c.name}
                      onChange={(e) => updateCourse(i, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input type="number" min="1" max="6" value={c.credits}
                      onChange={(e) => updateCourse(i, 'credits', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <select value={c.grade}
                      onChange={(e) => updateCourse(i, 'grade', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white"
                    >
                      {Object.keys(gradePoints).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => removeCourse(i)} className="text-gray-300 hover:text-status-error transition-colors">
                      <span className="material-symbols-outlined">remove_circle</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <button onClick={addCourse} className="flex items-center gap-1.5 text-navy font-medium text-sm hover:text-navy-light transition-colors">
            <span className="material-symbols-outlined text-lg">add_circle</span> Add Course
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-6 text-center shadow-lg">
        <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">Semester GPA</p>
        <p className="text-5xl font-bold text-gold mb-2">{gpa}</p>
        <div className="flex justify-center gap-8 text-sm">
          <div><p className="text-white/50">Credits</p><p className="text-white font-bold text-lg">{totalCredits}</p></div>
          <div><p className="text-white/50">Quality Points</p><p className="text-white font-bold text-lg">{weightedSum.toFixed(1)}</p></div>
        </div>
      </div>
    </div>
  )
}

function CGPATab() {
  const [semesters, setSemesters] = useState([{ name: 'Semester 1', credits: 0, gpa: 0.0 }])

  const addSem = () => setSemesters([...semesters, { name: `Semester ${semesters.length + 1}`, credits: 15, gpa: 3.0 }])
  const updateSem = (i, field, value) => {
    const updated = [...semesters]
    updated[i] = { ...updated[i], [field]: value }
    setSemesters(updated)
  }
  const removeSem = (i) => {
    if (semesters.length > 1) setSemesters(semesters.filter((_, idx) => idx !== i))
  }

  const totalCredits = semesters.reduce((sum, s) => sum + Number(s.credits), 0)
  const weightedSum = semesters.reduce((sum, s) => sum + Number(s.gpa) * Number(s.credits), 0)
  const cgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Semester</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white w-28">Credit Hrs</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white w-32">GPA Obtained</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((s, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-2.5">
                    <input type="text" value={s.name}
                      onChange={(e) => updateSem(i, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
                  </td>
                  <td className="px-4 py-2.5">
                    <input type="number" min="1" max="30" value={s.credits}
                      onChange={(e) => updateSem(i, 'credits', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
                  </td>
                  <td className="px-4 py-2.5">
                    <input type="number" min="0" max="4" step="0.01" value={s.gpa}
                      onChange={(e) => updateSem(i, 'gpa', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => removeSem(i)} className="text-gray-300 hover:text-status-error transition-colors">
                      <span className="material-symbols-outlined">remove_circle</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <button onClick={addSem} className="flex items-center gap-1.5 text-navy font-medium text-sm hover:text-navy-light transition-colors">
            <span className="material-symbols-outlined text-lg">add_circle</span> Add Semester
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-6 text-center shadow-lg">
        <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">Cumulative GPA (CGPA)</p>
        <p className="text-5xl font-bold text-gold mb-2">{cgpa}</p>
        <div className="flex justify-center gap-8 text-sm">
          <div><p className="text-white/50">Total Credits</p><p className="text-white font-bold text-lg">{totalCredits}</p></div>
          <div><p className="text-white/50">Weighted Sum</p><p className="text-white font-bold text-lg">{weightedSum.toFixed(1)}</p></div>
        </div>
      </div>
    </div>
  )
}

function GradingScaleTab({ gradeScale }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy">
              <th className="px-5 py-3.5 text-left text-sm font-semibold text-white">Marks Range</th>
              <th className="px-5 py-3.5 text-left text-sm font-semibold text-white">Grade</th>
              <th className="px-5 py-3.5 text-left text-sm font-semibold text-white">Grade Points</th>
            </tr>
          </thead>
          <tbody>
            {gradeScale.map((row, i) => (
              <tr key={row.id} className={i < gradeScale.length - 1 ? 'border-t border-gray-100' : ''}>
                <td className="px-5 py-3 text-sm text-gray-700">{row.min_marks}% – {row.max_marks}%</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-3 py-1 rounded-lg bg-navy/5 text-navy font-semibold text-sm">{row.grade_letter}</span>
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-gray-700">{row.grade_points.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function GPACalculator() {
  const [activeTab, setActiveTab] = useState(0)
  const [gradeScale, setGradeScale] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchScale() {
      const { data } = await supabase.from('grading_scale').select('*').order('grade_points', { ascending: false })
      if (data) setGradeScale(data)
      setLoading(false)
    }
    fetchScale()
  }, [])

  const tabs = [
    { label: 'GPA Calculator', component: GPATab },
    { label: 'CGPA Calculator', component: CGPATab },
    { label: 'Grading Scale', component: GradingScaleTab },
  ]

  const TabComponent = tabs[activeTab].component

  return (
    <div className="w-full mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-1">Grade Calculator</h1>
        <p className="text-gray-500">Calculate your GPA, CGPA, or view the UOL grading scale.</p>
      </div>
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex-1 min-w-0 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === i ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#173D32]/20 border-t-[#173D32] rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-400">Loading grading scale...</p>
        </div>
      ) : (
        <TabComponent gradeScale={gradeScale} />
      )}
    </div>
  )
}
