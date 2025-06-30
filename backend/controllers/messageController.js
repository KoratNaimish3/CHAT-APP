import Message from "../models/message.js"
import User from "../models/user.js"
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../index.js"

// Get all user except the logged in user

export const getUsersForSidebar = async (req, res) => {
    try {

        const userId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")

        //count number of message not seen
        const unseenMessages = {}

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })

        await Promise.all(promises)
        res.status(200).json({ success: true, users: filteredUsers, unseenMessages })


    } catch (error) {
        console.log("Error in getUsersForSidebar -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}

// Get all messages for selected user

export const getMessages = async (req, res) => {
    try {

        const { id: selectedUserId } = req.params;
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]

        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })
        res.status(200).json({ success: true, messages })

    } catch (error) {
        console.log("Error in getMessages -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}

//api to mark message is seen using message id

export const markMessageAsseen = async (req, res) => {
    try {
        const { id } = req.params //message ID
        await Message.findByIdAndUpdate(id, { seen: true })
        res.status(200).json({ success: true })

    } catch (error) {
        console.log("Error in markMessageAsseen -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}

//send message to selected user

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body
        const image = req.file

        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl;

        if (req.file) {
            const upload = await cloudinary.uploader.upload(image.path , { resource_type: "image" })
            imageUrl = upload.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        //emit the new message to the receiver's socket

        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json({ success: true, newMessage })

    } catch (error) {
        console.log("Error in sendMessage -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}