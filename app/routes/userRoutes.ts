import express from 'express'
const router = express.Router()
import * as userController from '../controllers/userController'
import {verifyToken} from "../middlewares/authMiddleware";

router.use(verifyToken)

router.get('/profile', userController.getUserProfile)
//router.put('/profile', userController.updateUserProfile)

export default router
