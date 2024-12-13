const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log environment variables
console.log('Environment Variables:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

// Define storage for images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

// Define storage for PDFs
const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'pdfs',
        allowed_formats: ['pdf'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

// Create multer instance for images and PDFs
const upload = multer({
    storage: multer.memoryStorage(), // Using memory storage to handle files before sending to Cloudinary
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
]);

// Middleware for handling uploads
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: 'Error uploading files' });
        }

        // Log request details
        console.log('Request Method:', req.method);
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        next();
    });
};

module.exports = { upload: uploadMiddleware, cloudinary };
