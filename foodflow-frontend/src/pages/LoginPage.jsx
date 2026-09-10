import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../services/api'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  // ── Animated canvas background (flowing color streams) ──
  useEffect(() => {
    setTimeout(() => setVisible(true), 80)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    // Particle streams
    const streams = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 180 + 80,
      hue: (i * 25) % 360,
      hueSpeed: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.12 + 0.04,
    }))

    let t = 0
    const draw = () => {
      ctx.fillStyle = 'rgba(6,4,14,0.18)'
      ctx.fillRect(0, 0, W, H)

      streams.forEach(s => {
        s.hue = (s.hue + s.hueSpeed + 360) % 360
        s.x += s.vx + Math.sin(t * 0.008 + s.hue) * 0.4
        s.y += s.vy + Math.cos(t * 0.007 + s.hue) * 0.4

        if (s.x < -s.r) s.x = W + s.r
        if (s.x > W + s.r) s.x = -s.r
        if (s.y < -s.r) s.y = H + s.r
        if (s.y > H + s.r) s.y = -s.r

        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
        g.addColorStop(0, `hsla(${s.hue},100%,65%,${s.alpha})`)
        g.addColorStop(0.5, `hsla(${(s.hue + 40) % 360},100%,55%,${s.alpha * 0.5})`)
        g.addColorStop(1, `hsla(${(s.hue + 80) % 360},100%,45%,0)`)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      t++
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password')
      setTimeout(() => setError(''), 3000)
      return
    }
    setLoading(true)
    try {
      const res = await adminLogin(username, password)
      localStorage.setItem('adminToken', res.data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
      setTimeout(() => setError(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Animated canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#06040e' }}
      />

      {/* ── Dark center vignette ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(6,4,14,0.55) 100%)' }}
      />

      {/* ── Login card ── */}
      <div
        className="relative z-10 w-full max-w-sm mx-6 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 mb-2">
            <div
              className="w-2.5 h-2.5 rounded-full bg-cyan-400"
              style={{ boxShadow: '0 0 12px 3px rgba(34,211,238,0.7)' }}
            />
            <span className="text-white font-bold text-xl tracking-tight">FoodFlow</span>
          </div>
          <p className="text-white/30 text-xs tracking-widest uppercase">Admin portal</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: 'rgba(15, 12, 30, 0.75)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          <h2 className="text-white font-semibold text-lg mb-1 tracking-tight">Welcome back</h2>
          <p className="text-white/30 text-xs mb-6">Sign in to your admin dashboard</p>

          {/* Error */}
          {error && (
            <div
              className="text-xs px-3 py-2.5 rounded-xl mb-5 flex items-center gap-2"
              style={{
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.25)',
                color: '#f87171',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="text-white/40 text-xs block mb-1.5 uppercase tracking-wider">Username</label>
            <input
              type="text"
              autoComplete="off"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 text-white text-sm outline-none rounded-xl placeholder:text-white/20 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
              onFocus={e => {
                e.target.style.border = '1px solid rgba(34,211,238,0.5)'
                e.target.style.background = 'rgba(34,211,238,0.04)'
                e.target.style.boxShadow = '0 0 20px rgba(34,211,238,0.08)'
              }}
              onBlur={e => {
                e.target.style.border = '1px solid rgba(255,255,255,0.09)'
                e.target.style.background = 'rgba(255,255,255,0.05)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <label className="text-white/40 text-xs block mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full px-4 py-3 text-white text-sm outline-none rounded-xl placeholder:text-white/20 transition-all duration-200 pr-10"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
                onFocus={e => {
                  e.target.style.border = '1px solid rgba(34,211,238,0.5)'
                  e.target.style.background = 'rgba(34,211,238,0.04)'
                  e.target.style.boxShadow = '0 0 20px rgba(34,211,238,0.08)'
                }}
                onBlur={e => {
                  e.target.style.border = '1px solid rgba(255,255,255,0.09)'
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition text-xs"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
              color: '#06040e',
              boxShadow: '0 0 30px rgba(34,211,238,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 45px rgba(34,211,238,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(34,211,238,0.3)'}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>

        <p className="text-center text-white/15 text-xs mt-5 tracking-wide">
          Only authorized admins can access this portal
        </p>
      </div>
    </div>
  )
}

export default LoginPage