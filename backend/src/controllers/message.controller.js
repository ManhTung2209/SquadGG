import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ],
        });

        // Mark messages as read
        if (messages.length > 0) {
            await Message.updateMany(
                {
                    senderId: userToChatId,
                    receiverId: myId,
                    isRead: false
                },
                { isRead: true }
            );
        }

        res.status(200).json(messages);
        
    } catch (error) {
        console.log("Error in getMessages", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            // upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await message.save();

        // Send realtime message to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.log("Error in sendMessage", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getUnreadMessages = async (req, res) => {
    try {
        const {id:otherUserId} = req.params;
        const myId = req.user._id;

        // Count unread messages from other user to me
        const unreadCount = await Message.countDocuments({
            senderId: otherUserId,
            receiverId: myId,
            isRead: false
        });

        res.status(200).json({ count: unreadCount });
    } catch (error) {
        console.log("Error in getUnreadMessages", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const markMessagesAsRead = async (req, res) => {
    try {
        const {id:otherUserId} = req.params;
        const myId = req.user._id;

        // Mark all messages from other user as read
        await Message.updateMany(
            {
                senderId: otherUserId,
                receiverId: myId,
                isRead: false
            },
            { isRead: true }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.log("Error in markMessagesAsRead", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}