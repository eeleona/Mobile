const fs = require("fs"); // Import fs for SSL certificates
const https = require("https"); // Use HTTPS instead of HTTP
require("dotenv").config({ path: '../.env' });

const Message = require("./models/messageModel");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require("./config/mongo_config");

const app = express();
const port = 8000;

// ✅ Load SSL Certificate Files
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/api.e-pet-adopt.site/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/api.e-pet-adopt.site/fullchain.pem"),
};

// ✅ Use HTTPS Server instead of HTTP
const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = ["https://e-pet-adopt.site", "null","http://localhost:3000"]; // ✅ Allow 'null' for mobile apps
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});


app.set("io", io);

// ✅ Ensure Express Uses HTTPS Middleware
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.use(express.json(), express.urlencoded({ extended: true }), cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging Middleware
app.use((req, res, next) => {
  console.log("🔹 Incoming Request Path:", req.path);
  console.log("🔹 Authorization Header:", req.headers["authorization"]);
  next();
});

// Import Routes
const UserRoutes = require("./routes/data_routes");
UserRoutes(app, upload);

const MessageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", MessageRoutes);

// Socket.IO Real-Time Messaging
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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Start HTTPS Server
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 HTTPS Server running on port ${port}`);
});
