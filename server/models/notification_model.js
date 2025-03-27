const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "recipientType" },
    recipientType: { type: String, required: true, enum: ["Admin", "Verified"] }, 
    message: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "adoption", "message", "approval"
    adoptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Adoption", default: null },
    petImage: { type: String, default: null }, 
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
