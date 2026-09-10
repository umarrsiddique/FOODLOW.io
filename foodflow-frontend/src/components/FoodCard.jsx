import { useCart } from '../context/CartContext'

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

function FoodCard({ item }) {
  const { addToCart } = useCart()
  const image = foodImageMap[item.name]

  return (
    <div className="bg-[#161624] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-400/25 transition-all hover:scale-[1.02]">
      <div className="h-36 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={item.name}
            className={`w-full h-full object-cover ${
              item.name === 'Oreo Shake' ? 'object-top' : 'object-center'
            }`}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white/30 text-sm"
            style={{ background: 'rgba(0,212,255,0.06)' }}
          >
            {item.name}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white font-medium text-sm mb-0.5">{item.name}</h3>
        <p className="text-white/30 text-xs mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-medium text-sm">Rs. {item.price}</span>
          <button
            onClick={() => addToCart({
              ...item,
              restaurantId: item.restaurant?.id,
              restaurantName: item.restaurant?.name
            })}
            className="w-6 h-6 bg-cyan-400 rounded-full text-[#0a0a14] font-bold text-lg flex items-center justify-center hover:bg-cyan-300 transition leading-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodCard