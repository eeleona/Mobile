

// Send a message
const Message = require("../models/messageModel");
const User = require("../models/user_model");
const Admin = require("../models/admin_model");
const Verified = require("../models/verified_model");
const { io } = require("../server"); 



exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    let sender = await User.findById(senderId) || await Verified.findById(senderId) || await Admin.findById(senderId);
    if (!sender) return res.status(404).json({ error: "Sender not found" });

    let receiver = await User.findById(receiverId) || await Verified.findById(receiverId) || await Admin.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    // Emit message using Socket.IO
    io.to(receiverId).emit("receiveMessage", newMessage);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Fetch messages where sender and receiver match either way
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by oldest first

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
