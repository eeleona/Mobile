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

// SSL options for HTTPS server
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/api.e-pet-adopt.site/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/api.e-pet-adopt.site/fullchain.pem"),
  // Modern TLS configuration
  minVersion: 'TLSv1.2',
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256'
  ].join(':'),
  honorCipherOrder: true
};

// ✅ Use HTTPS Server instead of HTTP
const server = https.createServer(options, app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://e-pet-adopt.site",
        "http://localhost:3000",
        "http://localhost:8081",
        /\.e-pet-adopt\.site$/,
        "exp://.*",
        /\.ngrok\.io$/,
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
        /^http:\/\/10\.0\.\d+\.\d+:\d+$/,
        "null"
      ];
      
      if (!origin || allowedOrigins.some(pattern => 
        typeof pattern === 'string' ? origin === pattern : pattern.test(origin)
      )) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST","PATCH", "DELETE"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: false
});

app.set("io", io);

// ✅ Ensure Express Uses HTTPS Middleware
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Multer Setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.use(express.json(), express.urlencoded({ extended: true }), cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging Middleware: Set CSP headers for security
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://unpkg.com; " +
    "script-src 'self' https://unpkg.com; " +
    "connect-src 'self' wss://api.e-pet-adopt.site:8000 https://api.e-pet-adopt.site:8000; " +
    "img-src 'self' https://api.e-pet-adopt.site:8000 data:; " + // Added API server URL
    "font-src 'self'; " +
    "report-uri /csp-violation-report-endpoint;"
  );
  next();
});

// Import Routes
const UserRoutes = require("./routes/data_routes");
UserRoutes(app, upload);

const MessageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", MessageRoutes);

// Socket.IO Real-Time Messaging
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    // console.log(`User ${userId} joined room`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      // console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Start HTTPS Server
server.listen(port, "0.0.0.0", () => {
  // console.log(`🚀 HTTPS Server running on port ${port}`);
});