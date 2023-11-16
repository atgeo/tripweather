import express from 'express'
const router = express.Router()
import * as tripController from '../controllers/tripController'
import {verifyToken} from '../middlewares/authMiddleware'

router.use(verifyToken)

router.post('/add', tripController.add)

router.put('/update/:tripId', tripController.update)

router.get('/my-trips', tripController.viewMyTrips)

export default router
