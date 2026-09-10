import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../services/api'
import socket from '../services/socket'
import barfi from '../assets/food/barfi.jpg'
import chickenbiryani from '../assets/food/chickenbiryani.jpg'
import chickenboti from '../assets/food/chickenboti.jpg'
import chocolate from '../assets/food/chocolate.jpg'
import chocolatecake from '../assets/food/chocolatecake.jpg'
import classicburger from '../assets/food/classicburger.jpg'
import crispyfries from '../assets/food/crispyfries.jpg'
import dahiballay from '../assets/food/dahiballay.jpg'
import golgappy from '../assets/food/golgappy.jpg'
import grillchicken from '../assets/food/grillchicken.jpg'
import gulabgamun from '../assets/food/gulabgamun.jpg'
import karahi from '../assets/food/karahi.jpg'
import kheer from '../assets/food/kheer.jpg'
import loadedfries from '../assets/food/loadedfries.jpg'
import muttonbiryani from '../assets/food/muttonbiryani.jpg'
import naan from '../assets/food/naan.jpg'
import oreoshake from '../assets/food/oreoshake.jpg'
import paprichaat from '../assets/food/paprichaat.jpg'
import raita from '../assets/food/raita.jpg'
import salad from '../assets/food/salad.jpg'
import samosa from '../assets/food/samosa.jpg'
import seekhkabab from '../assets/food/seekhkabab.jpg'
import smashburger from '../assets/food/smashburger.jpg'
import zingerburger from '../assets/food/zingerburger.jpg'

const foodImageMap = {
  'Seekh Kabab': seekhkabab,
  'Chicken Boti': chickenboti,
  'Mutton Karahi': karahi,
  'Naan Bread': naan,
  'Chicken Biryani': chickenbiryani,
  'Mutton Biryani': muttonbiryani,
  'Raita': raita,
  'Salad': salad,
  'Smash Burger': smashburger,
  'Crispy Fries': crispyfries,
  'Chocolate Shake': chocolate,
  'Grilled Chicken': grillchicken,
  'Gol Gappay': golgappy,
  'Dahi Bhalla': dahiballay,
  'Papri Chaat': paprichaat,
  'Samosa': samosa,
  'Classic Burger': classicburger,
  'Zinger Burger': zingerburger,
  'Loaded Fries': loadedfries,
  'Oreo Shake': oreoshake,
  'Gulab Jamun': gulabgamun,
  'Chocolate Cake': chocolatecake,
  'Barfi': barfi,
  'Kheer': kheer,
}

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const [ordered, setOrdered] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState('standard')
  const [deliveryFee, setDeliveryFee] = useState(totalPrice > 1500 ? 0 : 100)

  // Live-tracks the just-placed order's status/ETA on the confirmation screen -
  // extends the backend's Observer pattern all the way to the browser via WebSockets.
  useEffect(() => {
    if (!placedOrder) return

    socket.connect()
    socket.emit('joinOrder', placedOrder.id)

    const handleUpdate = (update) => {
      if (update.orderId === placedOrder.id) {
        setPlacedOrder((prev) => (prev ? { ...prev, status: update.status, estimatedMinutes: update.estimatedMinutes } : prev))
      }
    }
    socket.on('orderUpdate', handleUpdate)

    return () => {
      socket.off('orderUpdate', handleUpdate)
      socket.disconnect()
    }
  }, [placedOrder?.id])

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return
    setLoading(true)
    try {
      const orderData = {
        customerName: 'Guest',
        items: cartItems.map(i => `${i.name} × ${i.quantity}`).join(', '),
        total: totalPrice,
        restaurantId: cartItems[0].restaurantId || cartItems[0].restaurant?.id,
        address: address,
        phone: phone,
        deliveryType: deliveryType
      }
      const res = await placeOrder(orderData)
      const savedOrder = res.data

      // Remember this order on this device so "My Orders" can look it up later
      // (there's no customer login, so tracking is per-browser via localStorage).
      const savedIds = JSON.parse(localStorage.getItem('myOrderIds') || '[]')
      localStorage.setItem('myOrderIds', JSON.stringify([...savedIds, savedOrder.id]))

      clearCart()
      setPlacedOrder(savedOrder)
      setOrdered(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (ordered) {
    const status = placedOrder?.status || 'Pending'
    const eta = placedOrder?.estimatedMinutes
    const steps = [
      { key: 'Pending', icon: '✓', label: 'Order confirmed' },
      { key: 'Preparing', icon: '🍳', label: 'Being prepared' },
      { key: 'Delivered', icon: '🏠', label: 'Delivered' },
    ]
    const statusOrder = ['Pending', 'Preparing', 'Delivered']
    const currentIndex = statusOrder.indexOf(status)

    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-400/10 border border-cyan-400/25 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✅
          </div>
          <h2 className="text-white text-2xl font-medium mb-2">Order Placed!</h2>
          <p className="text-white/35 text-sm mb-2">Your food is being prepared 🍽️</p>
          {typeof eta === 'number' && status !== 'Delivered' && (
            <p className="text-cyan-400 text-xs mb-6 inline-flex items-center gap-1.5 bg-cyan-400/8 border border-cyan-400/20 px-3 py-1 rounded-full">
              ⏱ Estimated delivery in ~{eta} min · updates live
            </p>
          )}
          <div className="bg-[#161624] border border-white/5 rounded-2xl p-5 max-w-xs mx-auto mb-6 text-left">
            {steps.map((step, i) => {
              const done = i <= currentIndex
              const active = i === currentIndex
              return (
                <div key={step.key} className="flex items-center gap-3 py-2">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                      done ? 'text-cyan-400' : 'text-white/20'
                    }`}
                    style={
                      done
                        ? { background: active ? 'rgba(34,211,238,0.15)' : 'rgba(74,222,128,0.15)', borderColor: active ? 'rgba(34,211,238,0.3)' : 'rgba(74,222,128,0.3)' }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }
                    }
                  >
                    {done && i < currentIndex ? '✓' : step.icon}
                  </div>
                  <span className={`text-sm ${done ? 'text-white' : 'text-white/40'}`}>{step.label}</span>
                  <span className="text-white/30 text-xs ml-auto">
                    {i === currentIndex ? (typeof eta === 'number' ? `~${eta} min` : 'Now') : done ? '✓' : '—'}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/my-orders')}
              className="bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 px-5 py-2.5 rounded-xl text-sm hover:bg-cyan-400/20 transition"
            >
              View my orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-cyan-400 text-[#0a0a14] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-300 transition"
            >
              Order more
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-white text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-white/35 text-sm mb-6">Add some food from the menu!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-400 text-[#0a0a14] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-300 transition"
          >
            Browse restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-white font-medium text-lg mb-6">Your cart 🛒</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Cart items */}
          <div className="bg-[#161624] border border-white/5 rounded-2xl p-4">
            <h3 className="text-white text-sm font-medium mb-4">🛍️ Items</h3>
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-none">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  {foodImageMap[item.name] ? (
                    <img
                      src={foodImageMap[item.name]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-cyan-400/10 flex items-center justify-center text-xs text-white/30">
                      {item.name?.slice(0, 3)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-white/30 text-xs">Rs. {item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full border border-white/10 text-white flex items-center justify-center text-sm hover:bg-white/5"
                  >−</button>
                  <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full border border-white/10 text-white flex items-center justify-center text-sm hover:bg-white/5"
                  >+</button>
                </div>
                <span className="text-white text-sm w-16 text-right">Rs. {item.price * item.quantity}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-white/20 hover:text-red-400 transition text-sm"
                >🗑️</button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-[#161624] border border-white/5 rounded-2xl p-4 self-start">
            <h3 className="text-white text-sm font-medium mb-4">🧾 Order summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-xs text-white/35 py-1">
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}

            {/* Delivery type buttons */}
            <div className="flex gap-2 mt-4 mb-3">
              <button
                onClick={() => {
                  setDeliveryType('standard')
                  setDeliveryFee(totalPrice > 1500 ? 0 : 100)
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${
                  deliveryType === 'standard'
                    ? 'bg-cyan-400 text-[#0a0a14] border-cyan-400'
                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
                }`}
              >
                🚴 Standard
              </button>
              <button
                onClick={() => {
                  setDeliveryType('express')
                  setDeliveryFee(200)
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${
                  deliveryType === 'express'
                    ? 'bg-cyan-400 text-[#0a0a14] border-cyan-400'
                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
                }`}
              >
                ⚡ Express
              </button>
            </div>

            <div className="flex justify-between text-xs text-white/35 py-1 mt-2">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? '🎉 Free' : `Rs. ${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-white font-medium text-sm border-t border-white/5 mt-3 pt-3">
              <span>Total</span>
              <span className="text-cyan-400">Rs. {totalPrice + deliveryFee}</span>
            </div>

            <input
              placeholder="Delivery address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full mt-4 bg-[#0f0f1a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none mb-2 focus:border-cyan-400/40 placeholder:text-white/40"
            />
            <input
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none mb-3 focus:border-cyan-400/40 placeholder:text-white/40"
            />
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-2 bg-cyan-400 text-[#0a0a14] py-3 rounded-xl text-sm font-medium hover:bg-cyan-300 transition disabled:opacity-50"
            >
              {loading ? 'Placing order...' : 'Place order 🍽️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage