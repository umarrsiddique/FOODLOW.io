const menuItemRepository = require('../repositories/menuItemRepository');

// Replaces MenuItemService.java - same method names, same behavior.
async function getAllMenuItems() {
  return menuItemRepository.findAll();
}

async function getMenuItemsByRestaurant(restaurantId) {
  return menuItemRepository.findByRestaurantId(restaurantId);
}

async function saveMenuItem(menuItem) {
  return menuItemRepository.create(menuItem);
}

async function updateMenuItem(id, updatedItem) {
  const existing = await menuItemRepository.findById(id);
  if (!existing) return null;

  existing.name = updatedItem.name;
  existing.description = updatedItem.description;
  existing.price = updatedItem.price;
  existing.emoji = updatedItem.emoji;
  existing.category = updatedItem.category;
  existing.restaurant = updatedItem.restaurant || updatedItem.restaurantId;

  await existing.save();
  return existing;
}

async function deleteMenuItem(id) {
  return menuItemRepository.deleteById(id);
}

module.exports = {
  getAllMenuItems,
  getMenuItemsByRestaurant,
  saveMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
