// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Define routes for registration and login
router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/user', userController.getUserInfo);
router.post('/update-password', userController.updatePassword);
router.put('/update',userController.updateUserProfile);
router.put('/update', userController.updateUserProfile);


module.exports = router;
