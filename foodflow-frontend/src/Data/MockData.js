import bbq from '../assets/restaurants/bbq.jpg'
import biryani from '../assets/restaurants/biryani.jpg'
import cafe from '../assets/restaurants/cafe.jpg'
import chaat from '../assets/restaurants/chaat.jpg'
import burger from '../assets/restaurants/burger.jpg'
import bakery from '../assets/restaurants/bakery.jpg'

export const restaurants = [
  { id: 1, name: 'Burns Road Haji Sahab', image: bbq, cuisine: 'BBQ · Desi · Grill', rating: 4.8, deliveryTime: '25-35 min', deliveryFee: 80, status: 'Open', color: 'rgba(0,212,255,0.06)' },
  { id: 2, name: 'Student Biryani', image: biryani, cuisine: 'Biryani · Rice · Karahi', rating: 4.6, deliveryTime: '20-30 min', deliveryFee: 60, status: 'Open', color: 'rgba(139,92,246,0.06)' },
  { id: 3, name: 'Kolachi Restaurant', image: cafe, cuisine: 'Continental · Burgers · Shakes', rating: 4.5, deliveryTime: '30-40 min', deliveryFee: 100, status: 'Open', color: 'rgba(251,146,60,0.06)' },
  { id: 4, name: 'Disco Bakery', image: chaat, cuisine: 'Chaat · Gol Gappay · Dahi Bhalla', rating: 4.7, deliveryTime: '15-25 min', deliveryFee: 50, status: 'Open', color: 'rgba(34,197,94,0.06)' },
  { id: 5, name: 'Burger Lab', image: burger, cuisine: 'Burgers · Fries · Shakes', rating: 4.4, deliveryTime: '20-30 min', deliveryFee: 90, status: 'Open', color: 'rgba(236,72,153,0.06)' },
  { id: 6, name: 'Charcoal Grill', image: bakery, cuisine: 'Sweets · Cakes · Mithai', rating: 4.9, deliveryTime: '15-20 min', deliveryFee: 50, status: 'Open', color: 'rgba(234,179,8,0.06)' },
]

export const menuItems = [
  // Burns Road BBQ House
  { id: 1, restaurantId: 1, name: 'Seekh Kabab', description: 'Spiced minced beef, grilled on charcoal', price: 350, emoji: '🍖', category: 'BBQ' },
  { id: 2, restaurantId: 1, name: 'Chicken Boti', description: 'Marinated chunks, charcoal grilled', price: 420, emoji: '🍗', category: 'BBQ' },
  { id: 3, restaurantId: 1, name: 'Mutton Karahi', description: 'Slow cooked, spiced tomato base', price: 950, emoji: '🥩', category: 'Karahi' },
  { id: 4, restaurantId: 1, name: 'Naan Bread', description: 'Fresh from tandoor', price: 50, emoji: '🫓', category: 'Bread' },
  { id: 5, restaurantId: 1, name: 'Daal Chawal', description: 'Lentils with steamed rice', price: 280, emoji: '🍛', category: 'Rice' },
  { id: 6, restaurantId: 1, name: 'Shami Kabab', description: 'Pan fried, served with chutney', price: 300, emoji: '🧆', category: 'BBQ' },

  // Clifton Biryani Centre
  { id: 7, restaurantId: 2, name: 'Chicken Biryani', description: 'Aromatic basmati, tender chicken', price: 480, emoji: '🍛', category: 'Biryani' },
  { id: 8, restaurantId: 2, name: 'Mutton Biryani', description: 'Slow cooked mutton, fragrant rice', price: 650, emoji: '🍛', category: 'Biryani' },
  { id: 9, restaurantId: 2, name: 'Chicken Karahi', description: 'Spicy karahi, fresh tomatoes', price: 850, emoji: '🥘', category: 'Karahi' },
  { id: 10, restaurantId: 2, name: 'Raita', description: 'Yogurt with cucumber & mint', price: 80, emoji: '🥛', category: 'Sides' },
  { id: 11, restaurantId: 2, name: 'Salad', description: 'Fresh garden salad', price: 100, emoji: '🥗', category: 'Sides' },

  // DHA Café & Grill
  { id: 12, restaurantId: 3, name: 'Smash Burger', description: 'Double smash patty, special sauce', price: 650, emoji: '🍔', category: 'Burgers' },
  { id: 13, restaurantId: 3, name: 'Crispy Fries', description: 'Golden fries, seasoned', price: 250, emoji: '🍟', category: 'Sides' },
  { id: 14, restaurantId: 3, name: 'Chocolate Shake', description: 'Thick creamy chocolate shake', price: 350, emoji: '🥤', category: 'Drinks' },
  { id: 15, restaurantId: 3, name: 'Grilled Chicken', description: 'Herb marinated, char grilled', price: 750, emoji: '🍗', category: 'Grill' },

  // Tariq Road Chaat Corner
  { id: 16, restaurantId: 4, name: 'Gol Gappay', description: 'Crispy puris, tangy water', price: 150, emoji: '🫙', category: 'Chaat' },
  { id: 17, restaurantId: 4, name: 'Dahi Bhalla', description: 'Soft bhallas, sweet yogurt', price: 200, emoji: '🍲', category: 'Chaat' },
  { id: 18, restaurantId: 4, name: 'Papri Chaat', description: 'Crispy papri, chickpeas, chutney', price: 180, emoji: '🥗', category: 'Chaat' },
  { id: 19, restaurantId: 4, name: 'Samosa', description: 'Crispy, spiced potato filling', price: 60, emoji: '🥟', category: 'Snacks' },

  // Boat Basin Burger Co.
  { id: 20, restaurantId: 5, name: 'Classic Burger', description: 'Beef patty, lettuce, cheese', price: 450, emoji: '🍔', category: 'Burgers' },
  { id: 21, restaurantId: 5, name: 'Zinger Burger', description: 'Crispy chicken, spicy mayo', price: 520, emoji: '🍔', category: 'Burgers' },
  { id: 22, restaurantId: 5, name: 'Loaded Fries', description: 'Fries, cheese sauce, jalapenos', price: 350, emoji: '🍟', category: 'Sides' },
  { id: 23, restaurantId: 5, name: 'Oreo Shake', description: 'Thick oreo milkshake', price: 380, emoji: '🥤', category: 'Drinks' },

  // Gulshan Bakery & Sweets
  { id: 24, restaurantId: 6, name: 'Gulab Jamun', description: 'Soft, syrup soaked', price: 120, emoji: '🍮', category: 'Sweets' },
  { id: 25, restaurantId: 6, name: 'Chocolate Cake', description: 'Rich moist chocolate cake', price: 450, emoji: '🎂', category: 'Cakes' },
  { id: 26, restaurantId: 6, name: 'Barfi', description: 'Traditional milk barfi', price: 200, emoji: '🍬', category: 'Mithai' },
  { id: 27, restaurantId: 6, name: 'Kheer', description: 'Creamy rice pudding', price: 150, emoji: '🍚', category: 'Sweets' },
]