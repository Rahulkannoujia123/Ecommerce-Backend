const mongoose = require('mongoose');

// Create a user schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // The full name is required
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure that the email is unique
        lowercase: true, // Store email in lowercase
    },
    password: {
        type: String,
        required: true, // The password is required
    },
    phoneNumber:{
        type:String,
    },
   
    createdAt: {
        type: Date,
        default: Date.now, // Default to the current date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Default to the current date
    },
});

// Middleware to update the `updatedAt` field on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
