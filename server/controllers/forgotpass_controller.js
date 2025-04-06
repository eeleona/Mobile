const Verified = require('../models/verified_model');
const User = require('../models/user_model');
const Admin = require('../models/admin_model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendResetCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Verified.findOne({ v_emailadd: email }) ||
                     await User.findOne({ p_emailadd: email }) ||
                     await Admin.findOne({ a_email: email });

        if (!user) {
            return res.status(404).json({ message: "Email not found." });
        }

        // Generate a 6-digit code
        const resetCode = crypto.randomInt(100000, 999999).toString();

        // Store code and expiration in the user model
        user.reset_code = resetCode;
        user.reset_expires = Date.now() + 15 * 60 * 1000; // 15 minutes expiration
        await user.save();

        // Send email
        await transporter.sendMail({
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${resetCode}`
        });

        res.json({ message: "Reset code sent to email." });
    } catch (error) {
        console.error("Error sending reset code:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await Verified.findOne({ v_emailadd: email }) ||
                     await User.findOne({ p_emailadd: email }) ||
                     await Admin.findOne({ a_email: email });

        if (!user || user.reset_code !== code || user.reset_expires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        res.json({ message: "Code verified. You can now reset your password." });
    } catch (error) {
        console.error("Error verifying reset code:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await Verified.findOne({ v_emailadd: email }) ||
                     await User.findOne({ p_emailadd: email }) ||
                     await Admin.findOne({ a_email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        if (user.v_password) user.v_password = hashedPassword;
        if (user.p_password) user.p_password = hashedPassword;
        if (user.a_password) user.a_password = hashedPassword;

        // Clear reset code
        user.reset_code = null;
        user.reset_expires = null;
        await user.save();

        res.json({ message: "Password successfully reset." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports ={
    sendResetCode,
    verifyResetCode,
    resetPassword
}
