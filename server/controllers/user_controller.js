const User = require('../models/user_model');
const Verified = require('../models/verified_model');
const Admin = require('../models/admin_model');
const Adoption = require('../models/adoption_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const newUser = (req, res) => {
//     User.create(req.body)
//         .then((newUser) => {
//             res.status(201).json({ newUser, status: "successfully inserted" });
//         })
//         .catch((err) => {
//             console.error("Error creating user:", err);
//             res.status(500).json({ message: 'Something went wrong', error: err });
//         });
// }

const generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        username: user.p_username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const newUser = async (req, res) => {
    const { 
        p_username, p_emailadd, p_fname, p_lname, p_mname, p_password, 
        p_repassword, p_add, p_contactnumber, p_gender, p_birthdate 
    } = req.body;

    // Store the image paths as relative URLs
    const p_img = req.files['p_img'] ? `/uploads/images/${req.files['p_img'][0].filename}` : null; 
    const p_validID = req.files['p_validID'] ? `/uploads/images/${req.files['p_validID'][0].filename}` : null; 

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(p_password, 10);

        // Create a new user instance
        const user = new User({
            p_img, 
            p_username, 
            p_emailadd, 
            p_fname, 
            p_lname, 
            p_mname, 
            p_password: hashedPassword, // Store the hashed password
            p_add, 
            p_contactnumber, 
            p_gender, 
            p_birthdate, 
            p_validID,
            p_role: 'pending'
        });

        // Save the user to the database
        const savedUser = await user.save();
        res.status(201).json({ savedUser, status: "successfully inserted" });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};



const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user1 = await Verified.findOne({ v_username: username }).exec();
        const user2 = await User.findOne({ p_username: username }).exec();
        const user3 = await Admin.findOne({ a_username: username }).exec();

        if (!user1 && !user2 && !user3) {
            return res.status(404).json({ message: 'User not found' });
        }

        let user = user1 || user2 || user3; 
        let storedPassword = user1 ? user1.v_password : user2 ? user2.p_password : user3.a_password;
        let role = user1 ? user1.v_role : user2 ? user2.p_role : user3.s_role;
        let usernameField = user1 ? user1.v_username : user2 ? user2.p_username : user3.a_username;

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT
        const accessToken = jwt.sign(
            { id: user._id, username: usernameField, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', accessToken });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        let user;

        // Check the user's role and fetch the appropriate model
        if (req.user.role === 'pending') {
            user = await User.findOne({ p_username: req.user.username });
        } else if (req.user.role === 'verified') {
            user = await Verified.findOne({ v_username: req.user.username });
        } else if (req.user.role === 'admin') {
            user = await Admin.findOne({ a_username: req.user.username });
        }

        // If no user is found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Normalize user data for the response
        const normalizedUser = {
            username: user.p_username || user.v_username || user.a_username,
            firstName: user.p_fname || user.v_fname || user.a_fname,
            lastName: user.p_lname || user.v_lname || user.a_lname,
            gender: user.p_gender || user.v_gender || user.a_gender,
            birthday: user.p_birthdate || user.v_birthdate || user.a_birthdate,
            contactNumber: user.p_contactnumber || user.v_contactnumber || user.a_contactnumber,
            email: user.p_emailadd || user.v_emailadd || user.a_emailadd,
            address: user.p_add || user.v_add || user.a_add,
            profileImage: user.p_img || user.v_img || user.a_img // Handle image conversion if needed
        };

        res.status(200).json({ user: normalizedUser });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserAdoptions = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Fetch the verified user's _id
        const verifiedUser = await Verified.findOne({ v_username: req.user.username });
        if (!verifiedUser) {
            return res.status(404).json({ message: 'Verified user not found' });
        }

        const userId = verifiedUser._id;
        console.log('Fetching adoptions for user ID:', userId); // Log the user ID used for fetching adoptions

        // Fetch the user's adoptions and populate the user details
        const adoptions = await Adoption.find({ v_id: userId })
            .populate({
                path: 'p_id',
                select: 'p_name p_type p_age p_gender p_breed pet_img'
            })
            .populate({
                path: 'v_id',
                select: 'v_fname v_lname v_img'
            });

        if (adoptions.length === 0) {
            console.log('No adoptions found for this user:', userId); // Log when no adoptions are found
            return res.status(404).json({ message: 'No adoptions found for this user' });
        }

        // Prepare the response with adoption data
        const response = adoptions.map(adoption => ({
            ...adoption._doc, // Include all fields from the adoption document
            user: {
                firstName: adoption.v_id.v_fname,
                lastName: adoption.v_id.v_lname,
                profileImage: adoption.v_id.v_img
            }
        }));

        console.log('Adoptions found:', response); // Log the retrieved data
        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching user adoptions:', error); // Log errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const findAllUser = (req, res) => {
    User.find()
        .then((allTheUser) => {
            res.json({ users: allTheUser });
        }) 
        .catch((err) => {
            console.error("Error finding users:", err);
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
}

const findUserByUname = (req, res) => {
    User.findOne({ p_username: req.params.pusername })
        .then((theUser) => {
            if (!theUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user: theUser });
        })
        .catch((err) => {
            console.error("Error finding user by username:", err);
            res.status(500).json({ message: 'Something went wrong', error: err });
        });
}

const deleteUserById = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully', deletedUser });
        })
        .catch((err) => {
            console.error("Error deleting user:", err);
            res.status(500).json({ message: 'Error deleting user', error: err });
        });
};

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { v_role } = req.body;

    if (!['verified', 'admin', 'super-admin'].includes(v_role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const user = await Verified.findByIdAndUpdate(id, { v_role }, { new: true }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Role updated successfully', user });
    } catch (err) {
        console.error('Error updating role:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const { firstName, lastName, email, contactNumber, address, birthday } = req.body;
        let updatedFields = {};

        // Determine correct fields to update based on role
        if (req.user.role === 'pending') {
            updatedFields = {
                p_fname: firstName,
                p_lname: lastName,
                p_emailadd: email,
                p_contactnumber: contactNumber,
                p_add: address,
                p_birthdate: birthday
            };
            await User.findOneAndUpdate({ p_username: req.user.username }, updatedFields, { new: true });
        } else if (req.user.role === 'verified') {
            updatedFields = {
                v_fname: firstName,
                v_lname: lastName,
                v_emailadd: email,
                v_contactnumber: contactNumber,
                v_add: address, 
                v_birthdate: birthday
            };
            await Verified.findOneAndUpdate({ v_username: req.user.username }, updatedFields, { new: true });
        } else {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



module.exports = {
    generateAccessToken,
    newUser,
    findAllUser,
    findUserByUname,
    deleteUserById,
    login,
    updateUserRole,
    getUserProfile,
    getUserAdoptions,
    updateUserProfile 
}