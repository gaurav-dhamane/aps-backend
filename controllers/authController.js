// controllers/authController.js
const db = require('../config/db'); // Import database connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT || 'default_jwt_secret';

// Register User
exports.register = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO User (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json(JSON.stringify(err));
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login User
exports.login = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM User WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' , message : err});
        console.log("--->");
        console.log(results);
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
        res.json({ token });
    });
};
