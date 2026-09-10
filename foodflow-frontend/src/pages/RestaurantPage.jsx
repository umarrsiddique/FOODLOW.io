import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRestaurantById, getMenuByRestaurant } from '../services/api'
import { useCart } from '../context/CartContext'
import FoodCard from '../components/FoodCard'
import VoiceButton from '../components/VoiceButton'
import { parseVoiceOrder } from '../utils/voiceOrderParser'
import bbq from '../assets/restaurants/bbq.jpg'
import biryani from '../assets/restaurants/biryani.jpg'
import cafe from '../assets/restaurants/cafe.jpg'
import chaat from '../assets/restaurants/chaat.jpg'
import burger from '../assets/restaurants/burger.jpg'
import bakery from '../assets/restaurants/bakery.jpg'

const restImageMap = {
  'Burns Road Haji Sahab': bbq,
  'Student Biryani': biryani,
  'Kolachi Restaurant': cafe,
  'Disco Bakery': chaat,
  'Burger Lab': burger,
  'Charcoal Grill': bakery,
}

function RestaurantPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [restaurant, setRestaurant] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [voiceMessage, setVoiceMessage] = useState('')

  const handleVoiceOrder = (transcript) => {
    const { item, quantity } = parseVoiceOrder(transcript, items)
    if (item) {
      for (let i = 0; i < quantity; i++) {
        addToCart({ ...item, restaurantId: item.restaurant?.id, restaurantName: item.restaurant?.name })
      }
      setVoiceMessage(`✅ Added ${quantity} × ${item.name} to cart`)
    } else {
      setVoiceMessage(`❌ Couldn't find "${transcript}" on this menu`)
    }
    setTimeout(() => setVoiceMessage(''), 3500)
  }

  useEffect(() => {
    Promise.all([
      getRestaurantById(id),
      getMenuByRestaurant(id)
    ])
      .then(([restRes, menuRes]) => {
        setRestaurant(restRes.data)
        setItems(menuRes.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">⏳</div>
          <p className="text-white/40 text-sm">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">😕</div>
          <p className="text-white/40 text-sm">Restaurant not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-cyan-400 text-sm"
          >
            Go back home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/40 text-sm mb-5 bg-white/4 border border-white/8 px-3 py-1.5 rounded-lg hover:text-white transition"
        >
          ← Back to restaurants
        </button>

        <div className="bg-[#161624] border border-white/5 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={restImageMap[restaurant.name] || bbq}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-white font-medium text-base mb-1">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-white/35">
              <span>⭐ {restaurant.rating}</span>
              <span>🕐 {restaurant.deliveryTime}</span>
              <span>🛵 Rs. {restaurant.deliveryFee} delivery</span>
              <span>📍 Karachi</span>
            </div>
          </div>
          <span className="bg-green-400/15 text-green-400 border border-green-400/20 text-xs px-2 py-0.5 rounded-full">
            {restaurant.status}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-white font-medium text-sm">
            Menu items ({items.length})
          </h2>
          <VoiceButton
            onResult={handleVoiceOrder}
            title='Order by voice - try "add two chicken biryani"'
          />
          {voiceMessage && (
            <span className="text-xs text-cyan-400 bg-cyan-400/8 border border-cyan-400/20 px-3 py-1 rounded-full">
              {voiceMessage}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <FoodCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RestaurantPage