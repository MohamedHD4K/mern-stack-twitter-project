import { v2 as cloudinary } from "cloudinary"

import User from "../models/auth.model.js"
import Post from "../models/post.model.js"

export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        const userId = req.user._Id

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "User not found " })

        if (!img && !text) return res.status(400).json({ error: "Post must have text or image" })

        if (img) {
            const uploadedResponse = cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        res.status(201).json({ message: "Post Created", newPost })
    } catch (error) {
        console.log("Error in post create post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params

        const post = await Post.findById(postId)
        if (!post) res.status(404).json({ error: "Post not found" })

        const userLikedPost = post.likes.includes(userId)

        if(userLikedPost){
            
        }

    } catch (error) {
        console.log("Error in post link or unlink post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const commentOnPost = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in post comment post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) return res.status(404).josn({ error: "Post not found" })

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findOneAndDelete(req.params.id)
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.log("Error in delete post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}