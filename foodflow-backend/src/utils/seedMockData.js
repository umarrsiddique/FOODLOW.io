require('dotenv').config();
const connectDB = require('../config/db');
const { Restaurant, MenuItem } = require('../models');

// Matches the restaurant names hardcoded in the frontend's image maps
// (RestaurantCard.jsx / RestaurantPage.jsx) - keep names in sync if you change either side.
const restaurants = [
  { name: 'Burns Road Haji Sahab', emoji: '🍢', cuisine: 'BBQ · Desi · Grill', rating: 4.8, deliveryTime: '25-35 min', deliveryFee: 80, status: 'Open', color: 'rgba(0,212,255,0.06)' },
  { name: 'Student Biryani', emoji: '🍚', cuisine: 'Biryani · Rice · Karahi', rating: 4.6, deliveryTime: '20-30 min', deliveryFee: 60, status: 'Open', color: 'rgba(139,92,246,0.06)' },
  { name: 'Kolachi Restaurant', emoji: '☕', cuisine: 'Continental · Burgers · Shakes', rating: 4.5, deliveryTime: '30-40 min', deliveryFee: 100, status: 'Open', color: 'rgba(251,146,60,0.06)' },
  { name: 'Disco Bakery', emoji: '🥙', cuisine: 'Chaat · Gol Gappay · Dahi Bhalla', rating: 4.7, deliveryTime: '15-25 min', deliveryFee: 50, status: 'Open', color: 'rgba(34,197,94,0.06)' },
  { name: 'Burger Lab', emoji: '🍔', cuisine: 'Burgers · Fries · Shakes', rating: 4.4, deliveryTime: '20-30 min', deliveryFee: 90, status: 'Open', color: 'rgba(236,72,153,0.06)' },
  { name: 'Charcoal Grill', emoji: '🍰', cuisine: 'Sweets · Cakes · Mithai', rating: 4.9, deliveryTime: '15-20 min', deliveryFee: 50, status: 'Open', color: 'rgba(234,179,8,0.06)' },
];

// restaurantName below links each item to a restaurant above by name (resolved to a real
// ObjectId after the restaurants are inserted) - keeps this script self-contained.
const menuItemsByRestaurant = {
  'Burns Road Haji Sahab': [
    { name: 'Seekh Kabab', description: 'Spiced minced beef, grilled on charcoal', price: 350, emoji: '🍖', category: 'BBQ' },
    { name: 'Chicken Boti', description: 'Marinated chunks, charcoal grilled', price: 420, emoji: '🍗', category: 'BBQ' },
    { name: 'Mutton Karahi', description: 'Slow cooked, spiced tomato base', price: 950, emoji: '🥩', category: 'Karahi' },
    { name: 'Naan Bread', description: 'Fresh from tandoor', price: 50, emoji: '🫓', category: 'Bread' },
    { name: 'Daal Chawal', description: 'Lentils with steamed rice', price: 280, emoji: '🍛', category: 'Rice' },
    { name: 'Shami Kabab', description: 'Pan fried, served with chutney', price: 300, emoji: '🧆', category: 'BBQ' },
  ],
  'Student Biryani': [
    { name: 'Chicken Biryani', description: 'Aromatic basmati, tender chicken', price: 480, emoji: '🍛', category: 'Biryani' },
    { name: 'Mutton Biryani', description: 'Slow cooked mutton, fragrant rice', price: 650, emoji: '🍛', category: 'Biryani' },
    { name: 'Chicken Karahi', description: 'Spicy karahi, fresh tomatoes', price: 850, emoji: '🥘', category: 'Karahi' },
    { name: 'Raita', description: 'Yogurt with cucumber & mint', price: 80, emoji: '🥛', category: 'Sides' },
    { name: 'Salad', description: 'Fresh garden salad', price: 100, emoji: '🥗', category: 'Sides' },
  ],
  'Kolachi Restaurant': [
    { name: 'Smash Burger', description: 'Double smash patty, special sauce', price: 650, emoji: '🍔', category: 'Burgers' },
    { name: 'Crispy Fries', description: 'Golden fries, seasoned', price: 250, emoji: '🍟', category: 'Sides' },
    { name: 'Chocolate Shake', description: 'Thick creamy chocolate shake', price: 350, emoji: '🥤', category: 'Drinks' },
    { name: 'Grilled Chicken', description: 'Herb marinated, char grilled', price: 750, emoji: '🍗', category: 'Grill' },
  ],
  'Disco Bakery': [
    { name: 'Gol Gappay', description: 'Crispy puris, tangy water', price: 150, emoji: '🫙', category: 'Chaat' },
    { name: 'Dahi Bhalla', description: 'Soft bhallas, sweet yogurt', price: 200, emoji: '🍲', category: 'Chaat' },
    { name: 'Papri Chaat', description: 'Crispy papri, chickpeas, chutney', price: 180, emoji: '🥗', category: 'Chaat' },
    { name: 'Samosa', description: 'Crispy, spiced potato filling', price: 60, emoji: '🥟', category: 'Snacks' },
  ],
  'Burger Lab': [
    { name: 'Classic Burger', description: 'Beef patty, lettuce, cheese', price: 450, emoji: '🍔', category: 'Burgers' },
    { name: 'Zinger Burger', description: 'Crispy chicken, spicy mayo', price: 520, emoji: '🍔', category: 'Burgers' },
    { name: 'Loaded Fries', description: 'Fries, cheese sauce, jalapenos', price: 350, emoji: '🍟', category: 'Sides' },
    { name: 'Oreo Shake', description: 'Thick oreo milkshake', price: 380, emoji: '🥤', category: 'Drinks' },
  ],
  'Charcoal Grill': [
    { name: 'Gulab Jamun', description: 'Soft, syrup soaked', price: 120, emoji: '🍮', category: 'Sweets' },
    { name: 'Chocolate Cake', description: 'Rich moist chocolate cake', price: 450, emoji: '🎂', category: 'Cakes' },
    { name: 'Barfi', description: 'Traditional milk barfi', price: 200, emoji: '🍬', category: 'Mithai' },
    { name: 'Kheer', description: 'Creamy rice pudding', price: 150, emoji: '🍚', category: 'Sweets' },
  ],
};

async function seed() {
  await connectDB();
  console.log('✅ Connected to MongoDB');

  await MenuItem.deleteMany({});
  await Restaurant.deleteMany({});
  console.log('🗑️  Cleared existing restaurants and menu items');

  const createdRestaurants = await Restaurant.insertMany(restaurants);
  console.log(`✅ Inserted ${createdRestaurants.length} restaurants`);

  let menuItemCount = 0;
  for (const restaurant of createdRestaurants) {
    const items = menuItemsByRestaurant[restaurant.name] || [];
    const itemsWithRestaurant = items.map((item) => ({ ...item, restaurant: restaurant._id }));
    await MenuItem.insertMany(itemsWithRestaurant);
    menuItemCount += itemsWithRestaurant.length;
  }
  console.log(`✅ Inserted ${menuItemCount} menu items`);

  console.log('🌱 Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
