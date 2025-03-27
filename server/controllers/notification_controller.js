const Notification = require("../models/notification_model");
const Admin = require("../models/admin_model");
const Adoption = require("../models/adoption_model");
const { io } = require("../server");

// ✅ Notify Admins when a new adoption request is submitted
const notifyAdminsOnNewAdoption = async (adoptionId, adopterName, petName, petImage) => {
    try {
        const admins = await Admin.find({}, "_id");
        const adminIds = admins.map(admin => admin._id);

        const message = `New adoption request for ${petName}.`;
        const notifications = adminIds.map(adminId => ({
            recipientId: adminId,
            recipientType: "Admin",
            message,
            type: "adoption",
            adoptionId,  // Include adoption ID
            petImage     // Include pet image for display
        }));

        await Notification.insertMany(notifications);
        adminIds.forEach(adminId => {
            io.to(adminId.toString()).emit("receiveNotification", { 
                recipientId: adminId, message, type: "adoption", adoptionId, petImage 
            });
        });

        console.log("✅ Notification sent to all admins.");
    } catch (error) {
        console.error("❌ Error notifying admins:", error);
    }
};
// ✅ Notify Users when their adoption status changes
const notifyUserOnAdoptionUpdate = async (userId, adoptionStatus) => {
    try {
        const statusMessages = {
            accepted: "Your adoption has been accepted!",
            failed: "Your adoption failed.",
            declined: "Your adoption has been declined.",
            complete: "Your adoption is complete.",
            pending: "Your adoption is still pending."
        };

        const message = statusMessages[adoptionStatus] || "Your adoption status has been updated.";
        const newNotification = new Notification({
            recipientId: userId,
            recipientType: "Verified",
            message,
            type: "adoption"
        });

        await newNotification.save();
        io.to(userId.toString()).emit("receiveNotification", newNotification);

        console.log(`✅ Notification sent to user ${userId} about adoption status update.`);
    } catch (error) {
        console.error("❌ Error notifying user:", error);
    }
};

// ✅ Fetch notifications for Admins and Users (General)
const getNotifications = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized - No user detected" });
        }

        const notifications = await Notification.find({ recipientId: req.user.id }).sort({ createdAt: -1 });
        
        // 🔹 Ensure it always returns an array
        res.status(200).json(notifications || []);
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        res.status(500).json({ message: "Error fetching notifications" });
    }
};



// ✅ Fetch notifications for a specific user (User-side)
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const notifications = await Notification.find({ recipientId: userId, recipientType: "Verified" }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("❌ Error fetching user notifications:", error);
        res.status(500).json({ message: "Error fetching user notifications" });
    }
};

// ✅ Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ message: "✅ Notification marked as read" });
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        res.status(500).json({ message: "Error marking notification as read" });
    }
};

module.exports = {
    notifyAdminsOnNewAdoption,
    notifyUserOnAdoptionUpdate,
    getNotifications,
    getUserNotifications, // ✅ Make sure this is included
    markAsRead
};
