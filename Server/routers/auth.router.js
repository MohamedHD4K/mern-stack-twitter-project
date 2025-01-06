import express from 'express'
import { login, singin, logout, getMe } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.get("/me", protectRoute, getMe)

router.post("/singin", singin)

router.post("/login", login)

router.post("/logout", logout)

export default router