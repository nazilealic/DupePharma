const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const skinProfileController = require('../controllers/skinProfileController');

// #7 Nazile — POST /users/:userId/skin-profile
router.post('/:userId/skin-profile', protect, skinProfileController.createSkinProfile);

// #8 Nazile — PUT /users/:userId/skin-profile
router.put('/:userId/skin-profile', protect, skinProfileController.updateSkinProfile);

// #24 Bahar — PUT /users/:userId/password
const authController = require('../controllers/authController');
router.put('/:userId/password', protect, authController.passwordReset);

module.exports = router;