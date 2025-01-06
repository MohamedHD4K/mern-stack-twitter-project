import express from 'express'
import { login, singin, logout } from '../controllers/auth.controller.js'

const router =  express.Router()

router.get("/singin" ,  singin)

router.get("/login" ,  login)

router.get("/logout" ,  logout)

export default router