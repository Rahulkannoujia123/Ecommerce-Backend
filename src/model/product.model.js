// Import mongoose
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Product name is required
        trim: true, // Removes whitespace from the beginning and end of the string
    },
    description: {
        type: String,
        required: true, // Product description is required
    },
    price: {
        type: Number,
        required: true, // Price is required
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: true, // Every product must belong to a category
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory', // Reference to the Subcategory model
        required: false, // Subcategory is optional
    },
    image: {
        type: String, // URL of the product image
        required: false, // Image is optional
    },
    stock: {
        type: Number,
        required: true, // Stock quantity is required
        default: 0, // Default stock is 0
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Default to current date
    },
});

// Middleware to update `updatedAt` before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
