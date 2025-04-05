const fs = require("fs");
const https = require("https");
require("dotenv").config({ path: '../.env' });

const Message = require("./models/messageModel");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");

require("./config/mongo_config");

const app = express();
const port = 8000;

// SSL Certificate Files
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/api.e-pet-adopt.site/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/api.e-pet-adopt.site/fullchain.pem"),
};

const server = https.createServer(options, app);

// Enhanced CORS configuration
const allowedOrigins = [
  "https://e-pet-adopt.site",
  "http://localhost:3000",
  "http://localhost:8081", // For React Native development
  //"exp://192.168.*.*:8081", // For Expo development
  "null" // For mobile apps
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(allowed => origin.includes(allowed))) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.set("io", io);

// Security Middleware
app.use(helmet());
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Enhanced Multer Setup with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads/images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Increased payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enhanced Debugging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  next();
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Import Routes
const UserRoutes = require("./routes/data_routes");
UserRoutes(app, upload);

const MessageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", MessageRoutes);

// Socket.IO with enhanced error handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    if (!userId) {
      return socket.emit("error", "User ID is required");
    }
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      if (!senderId || !receiverId || !message) {
        throw new Error("Missing required fields");
      }
      
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("messageError", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 HTTPS Server running on port ${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});