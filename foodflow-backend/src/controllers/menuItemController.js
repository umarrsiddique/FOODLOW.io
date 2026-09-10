const menuItemService = require('../services/menuItemService');

// Replaces MenuItemController.java. Each function = one @RequestMapping method.
// req/res replace Spring's automatic request/response binding.

async function getAllMenuItems(req, res, next) {
  try {
    const items = await menuItemService.getAllMenuItems();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function getMenuByRestaurant(req, res, next) {
  try {
    const items = await menuItemService.getMenuItemsByRestaurant(req.params.restaurantId);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function addMenuItem(req, res, next) {
  try {
    const saved = await menuItemService.saveMenuItem(req.body);
    res.json(saved);
  } catch (err) {
    next(err);
  }
}

async function updateMenuItem(req, res, next) {
  try {
    const updated = await menuItemService.updateMenuItem(req.params.id, req.body);
    if (updated) return res.json(updated);
    return res.status(404).end();
  } catch (err) {
    next(err);
  }
}

async function deleteMenuItem(req, res, next) {
  try {
    await menuItemService.deleteMenuItem(req.params.id);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllMenuItems,
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
