import { useNavigate } from 'react-router-dom'
import bbq from '../assets/restaurants/bbq.jpg'
import biryani from '../assets/restaurants/biryani.jpg'
import cafe from '../assets/restaurants/cafe.jpg'
import chaat from '../assets/restaurants/chaat.jpg'
import burger from '../assets/restaurants/burger.jpg'
import bakery from '../assets/restaurants/bakery.jpg'

const imageMap = {
  'Burns Road Haji Sahab': bbq,
  'Student Biryani': biryani,
  'Kolachi Restaurant': cafe,
  'Disco Bakery': chaat,
  'Burger Lab': burger,
  'Charcoal Grill': bakery,
}

function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()
  const image = imageMap[restaurant.name] || bbq

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]"
      style={{
        background: '#161624',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 0 0 rgba(34,211,238,0)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(34,211,238,0.25)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,211,238,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'
        e.currentTarget.style.boxShadow = '0 0 0 rgba(34,211,238,0)'
      }}
    >
      {/* Image */}
      <div className="h-44 relative overflow-hidden">
        <img
          src={image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{
            objectPosition: restaurant.name === 'Burger Lab' ? 'top' : 'center',
          }}
        />
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161624]/80 via-transparent to-transparent" />

        {/* Status badge */}
        <span
          className="absolute top-2.5 left-2.5 text-xs px-2.5 py-0.5 rounded-full font-medium"
          style={
            restaurant.status === 'Open'
              ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }
              : { background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
          }
        >
          {restaurant.status === 'Open' ? '● Open' : '● Closed'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-white font-semibold text-sm mb-1.5 tracking-tight">{restaurant.name}</h3>
        <div className="flex items-center gap-3 text-xs text-white/35 mb-1.5">
          <span>⭐ {restaurant.rating}</span>
          <span>🕐 {restaurant.deliveryTime}</span>
          <span>🛵 Rs. {restaurant.deliveryFee}</span>
        </div>
        <p className="text-white/40 text-xs">{restaurant.cuisine}</p>
      </div>
    </div>
  )
}

export default RestaurantCard