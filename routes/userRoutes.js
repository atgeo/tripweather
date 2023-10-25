const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware.verifyToken)

router.get('/profile', userController.getUserProfile)
//router.put('/profile', userController.updateUserProfile)

module.exports = router