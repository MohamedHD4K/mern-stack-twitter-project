import express from "express"
import { createPost, likeUnlikePost, commentOnPost, getLikesPost, deletePost, getAllPosts, getFollowingPosts } from "../controllers/post.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/all", protectRoute, getAllPosts)

router.get("/likes/:id", protectRoute, getLikesPost)

router.get("/following", protectRoute, getFollowingPosts)

router.post("/create", protectRoute, createPost)

router.post("/like/:id", protectRoute, likeUnlikePost)

router.post("/comment/:id", protectRoute, commentOnPost)

router.delete("/:id", protectRoute, deletePost)

export default router