import { v2 as cloudinary } from "cloudinary"

import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;

        if (!req.user) return res.status(401).json({ error: "Unauthorized" });

        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!img && !text) return res.status(400).json({ error: "Post must have text or image" });

        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            } catch (err) {
                console.error("Cloudinary Upload Error:", err);
                return res.status(500).json({ error: "Image upload failed. Please try again later." });
            }
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save();
        res.status(201).json({ message: "Post Created", newPost });
    } catch (error) {
        console.error("Error in createPost controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ error: "Post not found" })

        const userLikedPost = post.likes.includes(userId)

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })

            const updatedLike = post.likes.filter((id) => id.toString() !== userId.toString())
            res.status(200).json(updatedLike)
        } else {
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()

            const newNotification = new Notification({
                from: req.user._id,
                to: post.user,
                type: "like",
            })
            await newNotification.save()

            const updatedLike = post.likes;
            res.status(200).json(updatedLike)
        }
    } catch (error) {
        console.log("Error in post like or unlike post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "User not found" })

        const post = await Post.findById(postId)
        if (!post) return res.status(400).json({ error: "Post not found" })

        if (!text) return res.status(400).json({ error: "Comment must have text " })

        post.comments.push({ text, user: userId })
        await post.save()

        res.status(200).json({ message: "Comment created successfully", post })
    } catch (error) {
        console.log("Error in post comment post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) return res.status(404).json({ error: "Post not found" })

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ error: "Post not found" });

        res.status(200).json({ message: `Post deleted ${req.params.id}` })
    } catch (error) {
        console.log("Error in delete post controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        })

        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export const getLikesPost = async (req, res) => {
    try {
        const userId = req.params.id

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "User not found" })

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password",
            }).populate({
                path: "comments.user",
                select: "-password",
            })

        if (likedPosts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error in get liked posts controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "User not found" })

        const followingPosts = await Post.find({ user: { $in: user.following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            }).populate({
                path: "comments.user",
                select: "-password",
            })

        if (followingPosts.length === 0) return res.status(200).json([])

        res.status(200).json(followingPosts)
    } catch (error) {
        console.log("Error in get following posts controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}