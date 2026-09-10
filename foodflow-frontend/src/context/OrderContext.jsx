import { createContext, useContext, useState } from 'react'

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([
    {
      id: '#1035',
      restaurant: 'Clifton Biryani Centre',
      items: 'Chicken Biryani × 2, Raita × 1',
      total: 960,
      status: 'Delivered',
      date: 'Yesterday, 7:45 PM',
    },
    {
      id: '#1028',
      restaurant: 'DHA Café & Grill',
      items: 'Smash Burger × 1, Fries × 2',
      total: 1200,
      status: 'Delivered',
      date: '2 days ago, 1:15 PM',
    },
  ])

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev])
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  return useContext(OrderContext)
}