const mongoose = require('mongoose');

// Create a main category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure that the category name is required
        unique: true,   // Ensure that the category name is unique
    },
    subcategories: [{ 
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references to Subcategory
        ref: 'Subcategory' // Reference to the Subcategory model
    }],
    image:{
        type:String
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

// Middleware to update the `updatedAt` field on save for categories
categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
