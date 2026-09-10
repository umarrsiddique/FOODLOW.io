import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrderById } from '../services/api'
import socket from '../services/socket'

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // No customer accounts exist, so "my orders" means "orders placed from this
    // browser" - tracked via the ids CartPage saves to localStorage on checkout.
    const ids = JSON.parse(localStorage.getItem('myOrderIds') || '[]')
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    Promise.all(
      ids.map((id) =>
        getOrderById(id)
          .then((res) => res.data)
          .catch(() => null) // order may have been removed - skip it silently
      )
    ).then((results) => {
      setOrders(results.filter(Boolean).reverse())
      setLoading(false)
    })
  }, [])

  // Live-tracks every one of this device's orders - extends the backend's Observer
  // pattern all the way to the browser via WebSockets, no polling/refresh needed.
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('myOrderIds') || '[]')
    if (ids.length === 0) return

    socket.connect()
    ids.forEach((id) => socket.emit('joinOrder', id))

    const handleUpdate = ({ orderId, status, estimatedMinutes }) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status, estimatedMinutes } : o)))
    }
    socket.on('orderUpdate', handleUpdate)

    return () => {
      socket.off('orderUpdate', handleUpdate)
      socket.disconnect()
    }
  }, [])

  const statusStyle = (status) => {
    if (status === 'Delivered') return 'bg-green-400/12 text-green-400 border border-green-400/20'
    if (status === 'Preparing') return 'bg-cyan-400/12 text-cyan-400 border border-cyan-400/20'
    return 'bg-orange-400/12 text-orange-400 border border-orange-400/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">⏳</div>
          <p className="text-white/40 text-sm">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a14]">

      {/* ── Cinematic Overlays (kept for the same visual depth, minus the video) ── */}
      <div className="absolute inset-0 z-10 bg-[#0a0a14]/70" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0a0a14]/60 via-transparent to-[#0a0a14]/80" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a14]/40 via-transparent to-[#0a0a14]/40" />
      <div className="absolute inset-0 z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,20,0.75) 100%)' }}
      />

      {/* ── Page Content ── */}
      <div className="relative z-20 min-h-screen py-8 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="mb-8">
            <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-1">Your history</p>
            <h2 className="text-white font-medium text-2xl">My orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-white/40 text-sm mb-4">No orders yet</p>
              <button
                onClick={() => navigate('/')}
                className="bg-cyan-400 text-[#0a0a14] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-300 transition"
              >
                Browse restaurants
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl p-4 transition hover:border-white/15"
                  style={{
                    background: 'rgba(22, 22, 36, 0.55)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">#{order.id}</span>
                    <span className="text-white/50 text-xs">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-2">
                    🏪 {order.restaurant?.name || 'Restaurant'}
                  </div>
                  <p className="text-white/25 text-xs mb-3">{order.items}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-medium text-sm">
                      Rs. {order.total + order.deliveryFee}
                    </span>
                    <div className="flex items-center gap-3">
                      {typeof order.estimatedMinutes === 'number' && order.status !== 'Delivered' && (
                        <span className="text-white/30 text-xs">⏱ ~{order.estimatedMinutes} min</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle(order.status)}`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => navigate('/')}
                        className="text-xs text-cyan-400 bg-cyan-400/8 border border-cyan-400/20 px-2.5 py-0.5 rounded-full hover:bg-cyan-400/15 transition"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default MyOrdersPage