const mongoose = require('mongoose');

// Create a subcategory schema
const BannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true,   
    },
    image: {
        type: String,
        required: true, 
    },

    createdAt: {
        type: Date,
        default: Date.now, 
    },
    updatedAt: {
        type: Date,
        default: Date.now, 
    },
});


const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
