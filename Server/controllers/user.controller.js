import User from "../models/auth.model.js"
import bcryptjs from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username }).select("-password")
        if (!user) res.status(404).json({ error: "User not found" })

        res.status(200).json({ user })
    } catch (error) {
        console.log("Error in get user profile controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id

        const usersFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                },
            },
            { $sample: { size: 10 } },
        ])

        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4)

        suggestedUsers.forEach((user) => (user.password = null))

        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log("Error in get user profile controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString()) return res.status(400).json({ error: "You can't follow or unfollow userself" })

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" })
        }

        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })

            res.status(200).json({ message: "User unfollowed successfully " })
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })

            const newNotification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: "follow",
            })

            await newNotification.save()
            res.status(200).json({ message: "User followed successfully " })
        }


    } catch (error) {
        console.log("Error in follow Unfollow User controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUserProfile = async (req, res) => {
    const { fullName, username, currentPassword, newPassword, link, email, bio } = req.body
    let { profileImg, coverImg } = req.body

    const userId = req.user._id

    try {

        let user = await User.findById(userId)
        if (!user) res.status(404).json({ error: "User not found" })

        if (!currentPassword && newPassword || currentPassword && !newPassword) {
            res.status(400).json({ error: "Please provide both current password and new password" })
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcryptjs.compare(currentPassword, user.password)
            if (!isMatch) res.status(400).json({ error: "Current password is incorrect" })
            if (newPassword.length < 6) {
                res.status(400).json({ error: "Password must by at least 6 characters long" })
            }

            const salt = bcryptjs.genSalt(10)
            user.password = bcryptjs.hash(newPassword, salt)
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader(profileImg)
            profileImg = uploadedResponse.secure_name
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader(coverImg)
            coverImg = uploadedResponse.secure_name;
        }

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()

        user.password = null

        res.status(200).json(user)
    } catch (error) {
        console.log("Error in get user profile update controller", error.message)
        return res.status(500).json({ error: "Internal server error" });
    }
}
