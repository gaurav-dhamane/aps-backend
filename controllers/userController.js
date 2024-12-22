// controllers/userController.js
const db = require('../config/db'); // Import database connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = process.env.JWT || 'default_jwt_secret';

// Get User Info by Token
exports.getUserInfo = (req, res) => {
    const token = req.headers.token.split(" ")[1]; // Extract the token from the Authorization header


    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secret);
        const userId = decoded.id; // Extract the user ID from the token

        // Query the database for user information
        const query = 'SELECT id, username, email, phone, address, ProfileLink FROM User WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Send user information as response
            const user = results[0];
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                phone:user.phone,
                address: user.address,
                profileLink: user.ProfileLink
            });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};




// Update Password
exports.updatePassword = (req, res) => {
    const token = req.headers.token?.split(" ")[1]; // Extract token from Authorization header
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, secret);
        const userId = decoded.id; // Extract the user ID

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Old and new passwords are required' });
        }
        console.log(oldPassword, newPassword)

        // Check if the old password matches
        const getPasswordQuery = 'SELECT password FROM User WHERE id = ?';
        db.query(getPasswordQuery, [userId], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const hashedPassword = results[0].password;

            // Compare oldPassword with hashed password
            const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
            if (!isMatch) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }

            // Hash the new password
            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the password in the database
            const updatePasswordQuery = 'UPDATE User SET password = ? WHERE id = ?';
            db.query(updatePasswordQuery, [newHashedPassword, userId], (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.status(500).json({ error: 'Failed to update password' });
                }

                res.status(200).json({ message: 'Password updated successfully' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Update User Profile
exports.updateUserProfile = (req, res) => {
    console.log(855)
    const token = req.headers.token?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Decode the token to get the user ID
        const decoded = jwt.verify(token, secret);
        const userId = decoded.id; // Extract the user ID

        const { username, email, phone, address, profileLink } = req.body;

        // Update the user information in the database
        const updateQuery = `
            UPDATE User
            SET username = ?, email = ?, phone = ?, address = ?, ProfileLink = ?
            WHERE id = ?
        `;
        db.query(updateQuery, [username, email, phone, address, profileLink, userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update user profile' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'User profile updated successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};