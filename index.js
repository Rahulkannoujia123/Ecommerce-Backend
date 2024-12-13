// index.js or app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./src/route/app'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json()); // Use this middleware if you're handling JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { // Use environment variable for URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(error => console.error("MongoDB connection error:", error));

// Use user routes
app.use('/user', userRoutes); // Add this line to use the user routes

// Example route
app.get('/', (req, res) => {
    res.send('Hello World!'); // Simple response for testing
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
