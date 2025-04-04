const jwt = require('jsonwebtoken'); // For handling authentication tokens
require('dotenv').config(); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🔹 Incoming Authorization Header:", authHeader); // Debugging

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

    console.log("✅ Decoded Token in Backend:", user);

    req.user = user;
    next();
  });
};



const handleSaveEvent = async () => {
  const token = await getToken();
  if (!token) {
    Alert.alert('Authentication Error', 'You are not authenticated. Please log in again.');
    return;
  }

  console.log("🔹 Retrieved Token in EditEvent.js:", token);

  // Decode the token
  try {
    const decodedToken = jwtDecode(token);
    console.log("✅ Decoded Token in EditEvent.js:", decodedToken);

    // Check if the role is super-admin
    if (decodedToken.role !== 'super-admin') {
      Alert.alert('Authorization Error', 'You do not have permission to perform this action.');
      return;
    }
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    Alert.alert('Authentication Error', 'Invalid token. Please log in again.');
    return;
  }

  // Proceed with the API request
  try {
    const response = await axios.put(
      `http://192.168.0.110:8000/api/events/update/${eventId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert('Success', 'Event updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    console.error('Error updating event:', error);
    Alert.alert('Error', 'Failed to update the event.');
  }
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
