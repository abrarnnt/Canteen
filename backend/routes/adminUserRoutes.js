const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');


// Get all admin users
router.get('/', adminUserController.getAllAdminUsers);

// Get single admin user by ID
router.get('/:id', adminUserController.getAdminUser);

// Create new admin user
router.post('/', adminUserController.createAdminUser);

// Update admin user
router.put('/:id', adminUserController.updateAdminUser);

// Delete admin user
router.delete('/:id', adminUserController.deleteAdminUser);

module.exports = router;
