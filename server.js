const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticateToken = require('./middleware/authMiddleware'); // Import middleware for protected routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Protected route (example)
app.use('/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Welcome to the protected route!', 
        user: req.user 
    });
});

// Start the server
app.listen(port, () => {
    console.log(`======================================`);
    console.log(`🚀 Server running at: http://localhost:${port}`);
    console.log(`📅 Started on: ${new Date().toLocaleString()}`);
    console.log(`======================================`);
});
