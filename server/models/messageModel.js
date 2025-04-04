const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    message: { type: String, required: true }, 
  },
  { timestamps: true }
);

// Indexing to improve query speed for conversations
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
