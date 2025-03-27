const jwt = require('jsonwebtoken'); // For handling authentication tokens
require('dotenv').config(); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("🔹 Incoming Authorization Header:", authHeader); // ✅ Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("⚠️ Missing or incorrect Authorization header:", authHeader);
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.warn("⚠️ Invalid Token:", err.message);
            return res.status(403).json({ message: "Forbidden - Invalid token" });
        }
        req.user = user;
        console.log("✅ Authenticated User:", user);
        next();
    });
};


// Middleware to check for admin or super-admin role
const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
        return res.sendStatus(403);
    }
    next();
};

// Middleware to check for super-admin role
const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super-admin') {
        return res.sendStatus(403);
    }
    next();
};

// Middleware to check for verified user role
const isVerifiedUser = (req, res, next) => {
    if (req.user.role !== 'verified' && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
        return res.sendStatus(403);
    }
    next();
};

// Middleware to check for pending user role
const isPendingUser = (req, res, next) => {
    if (req.user.role !== 'pending') {
        return res.sendStatus(403);
    }
    next();
};

module.exports = {
    authenticateJWT,
    isAdminOrSuperAdmin,
    isSuperAdmin,
    isVerifiedUser,
    isPendingUser

};
