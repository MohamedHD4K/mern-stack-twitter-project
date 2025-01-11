import express from "express"

import { createPost, likeUnlikePost, commentOnPost, deletePost } from "../controllers/post.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.post("/create", protectRoute, createPost)

// router.pots("/like/:id", protectRoute, likeUnlikePost)

// router.pots("/comment/:id", protectRoute, commentOnPost)

router.delete("/:id", protectRoute, deletePost)

export default router