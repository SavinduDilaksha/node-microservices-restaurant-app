const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

// GET    /api/menu       → Fetch all menu items
// POST   /api/menu       → Create a new menu item
router.route('/').get(getAllMenuItems).post(createMenuItem);

// GET    /api/menu/:id   → Get one menu item
// PUT    /api/menu/:id   → Update a menu item
// DELETE /api/menu/:id   → Delete a menu item
router.route('/:id').get(getMenuItemById).put(updateMenuItem).delete(deleteMenuItem);

module.exports = router;
