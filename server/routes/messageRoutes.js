const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const Message = require("../models/messageModel");
const User = require("../models/user_model");
const Verified = require("../models/verified_model");
require("dotenv").config();
const config = { address: process.env.SERVER_ADDRESS };


// ✅ Fetch users who have sent or received messages
router.get("/users", async (req, res) => {
    try {
        // Fetch all users (both normal and verified)
        const allUsers = await User.find({}, { _id: 1, p_fname: 1, p_lname: 1, p_img: 1 });
        const allVerifiedUsers = await Verified.find({}, { _id: 1, v_fname: 1, v_lname: 1, v_img: 1 });

        // Get unique users who have sent or received messages
        const uniqueUsers = await Message.aggregate([
            {
                $group: {
                    _id: null,
                    users: { $addToSet: "$senderId" },
                    receivers: { $addToSet: "$receiverId" }
                }
            },
            {
                $project: {
                    users: { $setUnion: ["$users", "$receivers"] }
                }
            }
        ]);

        const messagedUserIds = uniqueUsers.length > 0 
            ? uniqueUsers[0].users.map(id => id.toString()) 
            : [];

        // Fetch latest message for each user (both sender & receiver)
        const latestMessages = await Message.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: { $cond: [{ $gt: ["$senderId", "$receiverId"] }, "$senderId", "$receiverId"] },
                    latestMessage: { $first: "$message" },
                    createdAt: { $first: "$createdAt" }
                }
            }
        ]);

        // Convert latest messages to a map for quick lookup
        const latestMessageMap = {};
        latestMessages.forEach(msg => {
            latestMessageMap[msg._id.toString()] = {
                text: msg.latestMessage,
                createdAt: msg.createdAt
            };
        });

        // Merge users, ensuring uniqueness and attaching latest message
        let mergedUsers = [
            ...allUsers.map(user => ({
                _id: user._id.toString(),
                name: `${user.p_fname} ${user.p_lname}`,
                image: user.p_img ? `${config.address}${user.p_img}` : null,
                hasMessages: messagedUserIds.includes(user._id.toString()),
                latestMessage: latestMessageMap[user._id.toString()] || null
            })),
            ...allVerifiedUsers.map(user => ({
                _id: user._id.toString(),
                name: `${user.v_fname} ${user.v_lname}`,
                image: user.v_img ? `${config.address}${user.v_img}` : null,
                hasMessages: messagedUserIds.includes(user._id.toString()),
                latestMessage: latestMessageMap[user._id.toString()] || null
            }))
        ];

        // Sort users: those with messages first, then by latest message time
        mergedUsers.sort((a, b) => {
            if (b.hasMessages - a.hasMessages !== 0) {
                return b.hasMessages - a.hasMessages;
            }
            return (b.latestMessage?.createdAt || 0) - (a.latestMessage?.createdAt || 0);
        });

        res.json(mergedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// ✅ Fetch messages for an admin user (Corrected `createdAt`)
router.get("/admin/:adminId", async (req, res) => {
    try {
    const { adminId } = req.params;
    const messages = await Message.find({ receiverId: adminId }).sort({ createdAt: 1 }); // ✅ Fix: use `createdAt` instead of `timestamp`
    res.status(200).json(messages);
    } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// ✅ Fetch latest message for each user
router.get("/latest-messages", async (req, res) => {
    try {
        const latestMessages = await Message.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        sender: "$senderId",
                        receiver: "$receiverId"
                    },
                    latestMessage: { $first: "$message" },
                    createdAt: { $first: "$createdAt" },
                    senderId: { $first: "$senderId" },
                    receiverId: { $first: "$receiverId" }
                }
            }
        ]);

        res.json(latestMessages);
    } catch (error) {
        console.error("Error fetching latest messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// ✅ Send a message
router.post("/send", messageController.sendMessage);

// ✅ Get messages between two users
router.get("/:senderId/:receiverId", messageController.getMessages);

module.exports = router;