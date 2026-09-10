import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
})

// Attaches the admin JWT (if present) to every outgoing request.
// Public endpoints ignore the extra header; admin-only endpoints require it.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Admin auth
export const adminLogin = (username, password) => API.post('/admin/login', { username, password })

// Restaurants
export const getRestaurants = () => API.get('/restaurants')
export const getRestaurantById = (id) => API.get(`/restaurants/${id}`)
export const addRestaurant = (restaurant) => API.post('/restaurants', restaurant)
export const deleteRestaurant = (id) => API.delete(`/restaurants/${id}`)

// Menu
export const getMenuByRestaurant = (restaurantId) => API.get(`/menu/restaurant/${restaurantId}`)
export const addMenuItem = (item) => API.post('/menu', item)
export const updateMenuItem = (id, item) => API.put(`/menu/${id}`, item)
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`)

// Orders
export const getOrders = () => API.get('/orders')
export const getOrderById = (id) => API.get(`/orders/${id}`)
export const placeOrder = (order) => API.post('/orders', order)
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status })