import express from 'express'
import { protectRoute } from '../middleware/protectRoute'

const router = express.Router()

router.get("/", protectRoute, getNotifications)

router.delete("/", protectRoute, deleteNotifications)

export default router