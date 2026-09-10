import { useState, useEffect } from 'react'
import { getRestaurants } from '../services/api'
import RestaurantCard from '../components/RestaurantCard'
import VoiceButton from '../components/VoiceButton'

const HERO_SLIDES = [
  {
    badge: '📍 Delivering across Karachi',
    title: <>Best food in <span className="text-cyan-400" style={{ textShadow: '0 0 30px rgba(34,211,238,0.35)' }}>Karachi</span>,<br />delivered fast</>,
    sub: 'From Burns Road to DHA — order from your favourite restaurants',
    showSearch: true,
  },
  {
    badge: '🌙 Late night cravings?',
    title: <>We deliver till<br /><span className="text-cyan-400" style={{ textShadow: '0 0 30px rgba(34,211,238,0.35)' }}>2 AM</span> every night</>,
    sub: 'Midnight hunger sorted — BBQ, biryani, burgers, all available late night',
    showSearch: false,
  },
  {
    badge: '🔥 Hot deals today',
    title: <>Free delivery on your<br /><span className="text-cyan-400" style={{ textShadow: '0 0 30px rgba(34,211,238,0.35)' }}>first order</span></>,
    sub: 'Try FoodFlow today and get free delivery — no code needed',
    showSearch: false,
  },
  {
    badge: '⭐ Top rated in Karachi',
    title: <>6 restaurants,<br /><span className="text-cyan-400" style={{ textShadow: '0 0 30px rgba(34,211,238,0.35)' }}>hundreds</span> of choices</>,
    sub: 'From Burns Road BBQ to Student Biryani — all your favourites in one place',
    showSearch: false,
  },
]

function LandingPage() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  // Slide state
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('left') // 'left' | 'right'
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
    getRestaurants()
      .then(res => { setRestaurants(res.data); setLoading(false) })
      .catch(err => { console.error(err); setLoading(false) })
  }, [])

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => goTo((slide + 1) % HERO_SLIDES.length, 'left'), 4000)
    return () => clearInterval(timer)
  }, [slide])

  const goTo = (index, dir) => {
    if (animating || index === slide) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setDisplayed(index)
      setSlide(index)
      setAnimating(false)
    }, 350)
  }

  const current = HERO_SLIDES[displayed]

  return (
    <div className="min-h-screen bg-[#0f0f1a]">

      {/* ── Hero ── */}
      <div className="bg-[#0a0a14] px-6 py-14 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 bg-purple-500/5 rounded-full blur-3xl" />

        {/* Sliding content */}
        <div
          className="relative max-w-2xl mx-auto text-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          {/* Slide content with slide animation */}
          <div
            key={slide}
            style={{
              animation: animating
                ? `slideOut${direction === 'left' ? 'Left' : 'Right'} 0.35s ease forwards`
                : `slideIn${direction === 'left' ? 'Right' : 'Left'} 0.35s ease forwards`,
            }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 text-cyan-400 text-xs px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.18)' }}
            >
              {current.badge}
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold text-white mb-3 leading-tight tracking-tight">
              {current.title}
            </h1>

            <p className="text-white/30 text-sm mb-8 tracking-wide">{current.sub}</p>

            {/* Search bar — only on slide 0 */}
            {current.showSearch && (
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search restaurants or cuisine..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-white text-sm outline-none rounded-xl placeholder:text-white/20 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                />
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a0a14] bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all duration-150"
                  style={{ boxShadow: '0 0 20px rgba(34,211,238,0.25)' }}>
                  Search
                </button>
                <VoiceButton onResult={(transcript) => setSearch(transcript)} title="Search by voice" />
              </div>
            )}

            {/* CTA on non-search slides */}
            {!current.showSearch && (
              <button
                onClick={() => document.getElementById('restaurants-section').scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#0a0a14] bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all duration-150"
                style={{ boxShadow: '0 0 20px rgba(34,211,238,0.25)' }}
              >
                Order now →
              </button>
            )}
          </div>

          {/* Dot indicators + arrows */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, 'right')}
              className="text-white/20 hover:text-white/60 transition text-lg px-1"
            >
              ‹
            </button>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > slide ? 'left' : 'right')}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === slide ? '20px' : '6px',
                  height: '6px',
                  background: i === slide ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
            <button
              onClick={() => goTo((slide + 1) % HERO_SLIDES.length, 'left')}
              className="text-white/20 hover:text-white/60 transition text-lg px-1"
            >
              ›
            </button>
          </div>
        </div>

        {/* CSS keyframes injected */}
        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(40px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-40px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideOutLeft {
            from { opacity: 1; transform: translateX(0); }
            to   { opacity: 0; transform: translateX(-40px); }
          }
          @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to   { opacity: 0; transform: translateX(40px); }
          }
        `}</style>
      </div>

      {/* ── Restaurants ── */}
      <div id="restaurants-section" className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-base tracking-tight">Popular restaurants</h2>
          <span
            className="text-cyan-400 text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.15)' }}
          >
            {restaurants.filter(r =>
              r.name.toLowerCase().includes(search.toLowerCase()) ||
              r.cuisine.toLowerCase().includes(search.toLowerCase())
            ).length} available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-3" />
            <p className="text-white/30 text-sm">Loading restaurants...</p>
          </div>
        ) : restaurants.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(search.toLowerCase())
          ).length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-white/30 text-sm">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {restaurants
              .filter(r =>
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.cuisine.toLowerCase().includes(search.toLowerCase())
              )
              .map((r, i) => (
                <div
                  key={r.id}
                  className="transition-all duration-500"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage