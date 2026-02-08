import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloud.js";

//* Controller to get all users except logged in user
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUser = await User.find({_id: {$ne: userId}}).select("-password");

        //?count no.of unseen messages
        const unseenMsg = {}
        const promises = filteredUser.map(async (user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})

            if (messages.length > 0) {
                unseenMsg[user._id.toString()] = messages.length;
            }
        })

        await Promise.all(promises);
        res.json({success: true, users: filteredUser, unseenMsg});

    } catch (e) {
        console.log(e.message);
        return res.json({success: false, message: e.message})
    }
}

//* get all messages of selected user
export const getMessages = async (req, res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })
        
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages: messages});
    } catch (e) {
        console.log(e.message);
        return res.json({success: false, message: e.message})
    }
}

//* api to mark messages as seen using messageId
export const markMsgAsSeen = async (req, res) => {
    try {
        const {id: messageId} = req.params;
        
        const message = await Message.findByIdAndUpdate(messageId, {seen: true});
        res.json({success: true});
    } catch (e) {
        console.log(e.message);
        return res.json({success: false, message: e.message})
    }
}

//* send message to selected User
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }

        const newMsg = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        
        // ✅ Socket.io removed - won't work on Vercel serverless
        // Real-time updates would need polling or a different approach

        res.json({success: true, newMsg});

    } catch (e) {
        console.log(e.message);
        return res.json({success: false, message: e.message})
    }
}