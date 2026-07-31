const stats = [
  { value: '12', label: 'Buildings', icon: 'business' },
  { value: '1,200+', label: 'Teachers', icon: 'school' },
  { value: '35+', label: 'Departments', icon: 'account_tree' },
]

const features = [
  { icon: 'map', title: 'Room Finder', desc: 'Navigate campus with interactive satellite maps.' },
  { icon: 'calculate', title: 'GPA Calculator', desc: 'Track your academic performance with precision.' },
  { icon: 'star', title: 'Teacher Reviews', desc: 'Make informed decisions about your courses.' },
  { icon: 'photo', title: 'Memory Wall', desc: 'Share and cherish campus memories on a map.' },
]


export default function AboutUs() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[350px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/contact.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#173D32]/90 via-[#173D32]/75 to-[#173D32]/50" />
        <div className="relative max-w-5xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-gold text-xs font-medium rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              About
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">About UOL Nexus</h1>
            <p className="text-gray-200 max-w-lg">
              Your all-in-one digital companion for the University of Lahore campus experience.
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-6 py-10">

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-navy mb-4">Our Mission</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          UOL Nexus was created to streamline the campus experience for students, faculty, and visitors. We believe that technology can bridge the gap between academic life and digital convenience.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          From finding your classroom to calculating your GPA, from reviewing faculty to sharing campus memories — everything is designed with the UOL community in mind.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-gold-dark">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-navy">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-navy mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-navy">{f.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-navy text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-navy mb-6 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-white font-bold text-xs">{t.initial}</span>
              </div>
              <h3 className="font-bold text-navy text-sm">{t.name}</h3>
              <p className="text-xs text-gold-dark font-medium mb-1">{t.role}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>*/}
    </div>
    </div>
  )
}
