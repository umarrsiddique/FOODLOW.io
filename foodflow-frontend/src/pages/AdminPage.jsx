import { useState, useEffect } from 'react'
import {
  getRestaurants,
  getOrders,
  updateOrderStatus,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByRestaurant
} from '../services/api'

const emptyForm = { name: '', description: '', price: '', emoji: '', category: '', restaurantId: '' }

const statusStyle = (status) => {
  if (status === 'Delivered') return { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }
  if (status === 'Preparing') return { bg: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }
  return { bg: 'rgba(251,146,60,0.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.2)' }
}

const StatusBadge = ({ status }) => {
  const s = statusStyle(status)
  return (
    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, color: s.color, border: s.border }}>
      {status}
    </span>
  )
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    Promise.all([getRestaurants(), getOrders()])
      .then(([restRes, ordersRes]) => {
        setRestaurants(restRes.data)
        setOrders(ordersRes.data)
        return Promise.all(restRes.data.map(r => getMenuByRestaurant(r.id)))
      })
      .then(menuResults => {
        setMenuItems(menuResults.flatMap(res => res.data))
        setLoading(false)
        setTimeout(() => setVisible(true), 50)
      })
      .catch(err => { console.error(err); setLoading(false) })
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.price) return
    try {
      const itemData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        emoji: form.emoji,
        category: form.category,
        restaurantId: form.restaurantId
      }
      if (editId) {
        const res = await updateMenuItem(editId, itemData)
        setMenuItems(prev => prev.map(i => i.id === editId ? res.data : i))
        setEditId(null)
      } else {
        const res = await addMenuItem(itemData)
        setMenuItems(prev => [...prev, res.data])
      }
      setForm(emptyForm)
      setShowForm(false)
    } catch (err) { console.error(err) }
  }

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      emoji: item.emoji,
      category: item.category,
      restaurantId: String(item.restaurant?.id || '')
    })
    setEditId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id)
      setMenuItems(prev => prev.filter(i => i.id !== id))
    } catch (err) { console.error(err) }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateOrderStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? res.data : o))
    } catch (err) { console.error(err) }
  }

  const tabs = [
    { id: 'dashboard', icon: '▦', label: 'Dashboard' },
    { id: 'orders', icon: '≡', label: 'Orders' },
    { id: 'menu', icon: '⊞', label: 'Menu items' },
  ]

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white/30 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a14' }}>

      {/* Sidebar */}
      <div
        className="w-52 min-h-screen flex-shrink-0 flex flex-col"
        style={{ background: 'rgba(8,8,18,0.9)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="px-5 py-5 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(34,211,238,0.8)' }} />
            <span className="text-white font-semibold text-sm">FoodFlow</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.12)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a14]"
              style={{ background: '#22d3ee' }}>A</div>
            <div>
              <p className="text-white text-xs font-medium leading-none">Admin</p>
              <p className="text-white/30 text-xs mt-0.5">Super user</p>
            </div>
          </div>
        </div>

        <div className="px-3 flex-1">
          <p className="text-white/20 text-xs px-2 mb-2 uppercase tracking-widest">Navigation</p>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false) }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs mb-1 transition-all duration-200 flex items-center gap-2.5"
              style={activeTab === tab.id
                ? { background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }
                : { color: 'rgba(255,255,255,0.35)', border: '1px solid transparent' }}
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {tab.id === 'orders' && orders.filter(o => o.status === 'Pending').length > 0 && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold text-[#0a0a14]"
                  style={{ background: '#fb923c', fontSize: '10px' }}>
                  {orders.filter(o => o.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-white/15 text-xs">FoodFlow v1.0</p>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 p-7 overflow-auto transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-7">
              <p className="text-cyan-400/50 text-xs uppercase tracking-widest mb-1">Overview</p>
              <h2 className="text-white font-semibold text-xl">Dashboard</h2>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-7">
              {[
                { label: 'Total orders', value: orders.length, sub: 'All time', color: '#22d3ee', icon: '📋' },
                { label: 'Revenue', value: `Rs. ${revenue.toLocaleString()}`, sub: 'All time', color: '#4ade80', icon: '💰' },
                { label: 'Menu items', value: menuItems.length, sub: 'Active items', color: '#22d3ee', icon: '🍔' },
                { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, sub: 'Needs action', color: '#fb923c', icon: '⏳' },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: 'rgba(22,22,36,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-white/30 text-xs">{stat.label}</p>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                  <p className="text-white font-bold text-2xl mb-1"
                    style={{ color: stat.color === '#22d3ee' ? 'white' : stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs" style={{ color: stat.color }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(22,22,36,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white text-sm font-semibold">Recent orders</h3>
                  <p className="text-white/25 text-xs mt-0.5">Latest activity</p>
                </div>
                <button onClick={() => setActiveTab('orders')}
                  className="text-xs text-cyan-400 px-3 py-1.5 rounded-lg transition hover:scale-105 active:scale-95"
                  style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs text-white/20 pb-2.5 mb-1"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Order</span><span>Items</span><span>Amount</span><span>Status</span>
              </div>
              {orders.slice(0, 5).map((order, i) => (
                <div key={order.id}
                  className="grid grid-cols-4 gap-4 text-xs py-3 items-center transition-all duration-150 hover:bg-white/2 rounded-lg px-1"
                  style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <span className="text-white font-semibold">#{order.id}</span>
                  <span className="text-white/40 truncate">{order.items}</span>
                  <span className="text-white/50">Rs. {order.total}</span>
                  <StatusBadge status={order.status} />
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-white/20 text-xs text-center py-6">No orders yet</p>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div className="mb-7">
              <p className="text-cyan-400/50 text-xs uppercase tracking-widest mb-1">Manage</p>
              <h2 className="text-white font-semibold text-xl">All orders</h2>
            </div>
            <div className="rounded-2xl p-5 overflow-x-auto"
              style={{ background: 'rgba(22,22,36,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-8 gap-3 text-xs text-white/20 pb-2.5 mb-1 min-w-[900px]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Order ID</span>
                <span>Items</span>
                <span>Total</span>
                <span>Delivery fee</span>
                <span>Type</span>
                <span>Address</span>
                <span>Phone</span>
                <span>Status</span>
              </div>
              {orders.map((order, i) => (
                <div key={order.id}
                  className="grid grid-cols-8 gap-3 text-xs py-3.5 items-center rounded-lg px-1 transition hover:bg-white/2 min-w-[900px]"
                  style={{ borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <span className="text-white font-semibold">#{order.id}</span>
                  <span className="text-white/40 truncate">{order.items}</span>
                  <span className="text-white/50">Rs. {order.total}</span>
                  <span className="text-white/50">Rs. {order.deliveryFee}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full w-fit"
                    style={order.deliveryType === 'express'
                      ? { background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }
                      : { background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                    {order.deliveryType || 'standard'}
                  </span>
                  <span className="text-white/40 truncate">{order.address || '—'}</span>
                  <span className="text-white/40">{order.phone || '—'}</span>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-full outline-none cursor-pointer w-fit font-medium"
                    style={(() => { const s = statusStyle(order.status); return { background: s.bg, color: s.color, border: s.border } })()}
                  >
                    {['Pending', 'Preparing', 'Delivered'].map(s => (
                      <option key={s} value={s} style={{ background: '#161624', color: 'white' }}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-white/20 text-xs text-center py-6">No orders yet</p>
              )}
            </div>
          </div>
        )}

        {/* MENU ITEMS */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-cyan-400/50 text-xs uppercase tracking-widest mb-1">Manage</p>
                <h2 className="text-white font-semibold text-xl">Menu items</h2>
              </div>
              <button
                onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null) }}
                className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95"
                style={{ background: '#22d3ee', color: '#0a0a14' }}>
                + Add item
              </button>
            </div>

            {showForm && (
              <div className="rounded-2xl p-5 mb-6"
                style={{ background: 'rgba(22,22,36,0.9)', border: '1px solid rgba(34,211,238,0.15)', boxShadow: '0 0 30px rgba(34,211,238,0.05)' }}>
                <h3 className="text-white text-sm font-semibold mb-4">
                  {editId ? '✏️ Edit item' : '➕ Add new item'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Name', key: 'name', placeholder: 'e.g. Seekh Kabab' },
                    { label: 'Emoji', key: 'emoji', placeholder: '🍖' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-white/30 text-xs block mb-1">{f.label}</label>
                      <input
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 text-white text-xs outline-none rounded-xl placeholder:text-white/20 transition focus:scale-[1.01]"
                        style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={e => e.target.style.border = '1px solid rgba(34,211,238,0.4)'}
                        onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="text-white/30 text-xs block mb-1">Description</label>
                    <input
                      placeholder="Short description..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 text-white text-xs outline-none rounded-xl placeholder:text-white/20"
                      style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => e.target.style.border = '1px solid rgba(34,211,238,0.4)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div>
                    <label className="text-white/30 text-xs block mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      placeholder="350"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full px-3 py-2 text-white text-xs outline-none rounded-xl placeholder:text-white/20"
                      style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => e.target.style.border = '1px solid rgba(34,211,238,0.4)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div>
                    <label className="text-white/30 text-xs block mb-1">Category</label>
                    <input
                      placeholder="e.g. BBQ"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 text-white text-xs outline-none rounded-xl placeholder:text-white/20"
                      style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => e.target.style.border = '1px solid rgba(34,211,238,0.4)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/30 text-xs block mb-1">Restaurant</label>
                    <select
                      value={form.restaurantId}
                      onChange={e => setForm({ ...form, restaurantId: e.target.value })}
                      className="w-full px-3 py-2 text-white text-xs outline-none rounded-xl"
                      style={{ background: 'rgba(15,15,26,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => e.target.style.border = '1px solid rgba(34,211,238,0.4)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
                    >
                      <option value="">Select restaurant</option>
                      {restaurants.map(r => (
                        <option key={r.id} value={r.id} style={{ background: '#0f0f1a' }}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={handleSubmit}
                    className="px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
                    style={{ background: '#22d3ee', color: '#0a0a14' }}>
                    {editId ? 'Update item' : 'Add item'}
                  </button>
                  <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null) }}
                    className="px-5 py-2 rounded-xl text-xs text-white/40 transition-all duration-150 hover:text-white/70"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(22,22,36,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-5 gap-4 text-xs text-white/20 pb-2.5 mb-1"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>Item</span><span>Restaurant</span><span>Category</span><span>Price</span><span>Actions</span>
              </div>
              {menuItems.map((item, i) => (
                <div key={item.id}
                  className="grid grid-cols-5 gap-4 text-xs py-3.5 items-center rounded-lg px-1 transition-all duration-150 group hover:bg-white/2"
                  style={{ borderBottom: i < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <div className="flex items-center gap-2">
                    {item.emoji
                      ? <span className="text-base">{item.emoji}</span>
                      : <div className="w-6 h-6 rounded-lg" style={{ background: 'rgba(34,211,238,0.08)' }} />
                    }
                    <span className="text-white font-medium truncate">{item.name}</span>
                  </div>
                  <span className="text-white/35 truncate">{item.restaurant?.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full w-fit"
                    style={{ background: 'rgba(34,211,238,0.07)', color: 'rgba(34,211,238,0.6)', border: '1px solid rgba(34,211,238,0.12)' }}>
                    {item.category}
                  </span>
                  <span className="text-cyan-400 font-semibold">Rs. {item.price}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button onClick={() => handleEdit(item)}
                      className="px-2.5 py-1 rounded-lg text-xs transition-all hover:scale-105"
                      style={{ background: 'rgba(34,211,238,0.08)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 rounded-lg text-xs transition-all hover:scale-105"
                      style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage