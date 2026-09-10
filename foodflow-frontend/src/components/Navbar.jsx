import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = !!localStorage.getItem('adminToken')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm transition-all duration-200 relative group ${
        location.pathname === path ? 'text-white' : 'text-white/40 hover:text-white/80'
      }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-px bg-cyan-400 transition-all duration-300 ${
        location.pathname === path ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  )

  return (
    <nav className="px-6 py-3 flex items-center justify-between sticky top-0 z-50"
      style={{
        background: 'rgba(10, 10, 20, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_2px_rgba(34,211,238,0.6)] transition-all duration-300" />
        <span className="text-white font-semibold text-base tracking-tight">FoodFlow</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-7">
        {navLink('/', 'Home')}
        {navLink('/my-orders', 'My Orders')}
        {isAdmin ? (
          <>
            {navLink('/admin', 'Admin')}
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white/80 text-sm transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          navLink('/login', 'Admin')
        )}
      </div>

      {/* Cart */}
      <Link
        to="/cart"
        className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium text-cyan-400 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: 'rgba(34,211,238,0.08)',
          border: '1px solid rgba(34,211,238,0.25)',
        }}
      >
        🛒 Cart
        {totalItems > 0 && (
          <span className="bg-cyan-400 text-[#0a0a14] text-xs font-bold rounded-full px-1.5 py-0.5 animate-pulse">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  )
}

export default Navbar