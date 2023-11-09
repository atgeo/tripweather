const express = require('express')
const router = express.Router()
const tripController = require('../controllers/tripController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware.verifyToken)

router.post('/add', tripController.add)

router.put('/update/:tripId', tripController.update)

router.get('/my-trips', tripController.viewMyTrips)

module.exports = router
