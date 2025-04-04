require('dotenv').config({ path: "../.env" });
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

require("./config/mongo_config");

const app = express();
const server = http.createServer(app);
const port = 8000;

// 🔹 Initialize `io` early to prevent circular dependency
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

app.set("io", io);

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/images/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(express.json(), express.urlencoded({ extended: true }), cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debugging Middleware
app.use((req, res, next) => {
    console.log('Authorization header:', req.headers['authorization']);
    console.log('🔹 Incoming Request Path:', req.path);
    console.log('🔹 Incoming Authorization Header:', req.headers['authorization']);
    next();
});

// 🔹 Import Routes (after setting up `io`)
const UserRoutes = require("./routes/data_routes");
UserRoutes(app, upload);

const MessageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", MessageRoutes);

const Adoption = require("./models/adoption_model");

// 🔹 **Socket.IO Real-Time Messaging & Notifications**
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        try {
            const newMessage = new Message({ senderId, receiverId, message });
            await newMessage.save();
            io.to(receiverId).emit("receiveMessage", newMessage);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on("joinNotifications", (adminId) => {
        socket.join(adminId);
        console.log(`Admin ${adminId} joined notifications room`);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Adoption Status API
// app.get('/api/adoptions/status/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const adoptions = await Adoption.find({ v_id: userId });

//         const notifications = adoptions.map(adoption => {
//             let statusText = "Your adoption is still pending.";

//             if (adoption.status === "accepted") statusText = "Your adoption has been accepted!";
//             if (adoption.status === "failed") statusText = `Your adoption failed: ${adoption.failedReason}`;
//             if (adoption.status === "declined") statusText = "Your adoption has been declined.";
//             if (adoption.status === "complete") statusText = "Your adoption process is complete.";

//             return { id: adoption._id, text: statusText };
//         });

//         res.json(notifications);
//     } catch (error) {
//         console.error("Error fetching adoption status:", error);
//         res.status(500).json({ message: "Error fetching adoption status" });
//     }
// });

// Start Server
server.listen(port, () => console.log(`Server running on port ${port}`));
