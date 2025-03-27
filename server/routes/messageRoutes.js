const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const Message = require("../models/messageModel");
const User = require("../models/user_model");
const Verified = require("../models/verified_model");

// ✅ Fetch users who have sent or received messages
router.get("/users", async (req, res) => {
    try {
        const uniqueUsers = await Message.aggregate([
            { $group: { _id: null, senders: { $addToSet: "$senderId" }, receivers: { $addToSet: "$receiverId" } } },
            { $project: { users: { $setUnion: ["$senders", "$receivers"] } } }
        ]);

        const userIds = uniqueUsers.length > 0 ? uniqueUsers[0].users : [];

        // Fetch users from User and Verified collections
        const users = await User.find(
            { _id: { $in: userIds } },
            { _id: 1, p_fname: 1, p_lname: 1, p_img: 1 }
        );

        const verifiedUsers = await Verified.find(
            { _id: { $in: userIds } },
            { _id: 1, v_fname: 1, v_lname: 1, v_img: 1 }
        );

        // Format user data with image URLs
        const formattedUsers = [
            ...users.map(user => ({
                _id: user._id,
                name: `${user.p_fname} ${user.p_lname}`,
                image: user.p_img ? `http://localhost:8000${user.p_img}` : null, 
            })),
            ...verifiedUsers.map(user => ({
                _id: user._id,
                name: `${user.v_fname} ${user.v_lname}`,
                image: user.v_img ? `http://localhost:8000${user.v_img}` : null, 
            }))
        ];

        res.json(formattedUsers);
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
            { $sort: { createdAt: -1 } }, // ✅ Fix: Use `createdAt`
            { $group: { _id: "$senderId", latestMessage: { $first: "$message" }, createdAt: { $first: "$createdAt" } } },
            { 
                $lookup: { 
                    from: "users", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "senderData" 
                } 
            },
            { 
                $lookup: { 
                    from: "verifieds", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "verifiedSenderData" 
                } 
            },
            { $project: { 
                _id: 1, 
                latestMessage: 1, 
                createdAt: 1, 
                senderName: { 
                    $cond: { if: { $gt: [{ $size: "$senderData" }, 0] }, then: { $arrayElemAt: ["$senderData.p_username", 0] }, else: { $arrayElemAt: ["$verifiedSenderData.v_username", 0] } } 
                } 
            }}
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
