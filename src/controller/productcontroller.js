// Import required modules
const cloudinary = require('cloudinary').v2;
const Product = require('../model/product.model'); // Assuming Product model is in the models folder

// Configure Cloudinary

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId,  stock } = req.body;
        let imageUrl = null;

        if (req.files && req.files.image && req.files.image[0]) {
            const imageFile = req.files.image[0];
            imageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products', resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            return reject(error);
                        }
                        resolve(result.secure_url);
                    }
                );
                uploadStream.end(imageFile.buffer);
            });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            categoryId,
            stock,
            image: imageUrl,
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error while adding product:', error);
        res.status(500).json({ message: 'An error occurred while adding the product.' });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.query;
        const { name, description, price, categoryId,  stock } = req.body;
        let imageUrl = null;

        if (req.files && req.files.image && req.files.image[0]) {
            const imageFile = req.files.image[0];
            imageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products', resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            return reject(error);
                        }
                        resolve(result.secure_url);
                    }
                );
                uploadStream.end(imageFile.buffer);
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                categoryId,
                stock,
                ...(imageUrl && { image: imageUrl }),
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error while updating product:', error);
        res.status(500).json({ message: 'An error occurred while updating the product.' });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.query;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            product: deletedProduct,
        });
    } catch (error) {
        console.error('Error while deleting product:', error);
        res.status(500).json({ message: 'An error occurred while deleting the product.' });
    }
};
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryId')

        res.status(200).json({
            message: 'Products retrieved successfully',
            products,
        });
    } catch (error) {
        console.error('Error while fetching products:', error);
        res.status(500).json({ message: 'An error occurred while fetching products.' });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.query;
        const product = await Product.findById(id).populate('category').populate('subcategory');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product retrieved successfully',
            product,
        });
    } catch (error) {
        console.error('Error while fetching product:', error);
        res.status(500).json({ message: 'An error occurred while fetching the product.' });
    }
};
// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.query; // Category ID passed as a URL parameter

        // Fetch products with the given categoryId
        const products = await Product.find({ categoryId })
            .populate('categoryId')  // Populate category details if needed
            .populate('subcategoryId'); // Populate subcategory details if needed

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }

        res.status(200).json({
            message: 'Products retrieved successfully',
            products,
        });
    } catch (error) {
        console.error('Error while fetching products by category:', error);
        res.status(500).json({ message: 'An error occurred while fetching products by category.' });
    }
};
exports.deleteMultipleProduct = async (req, res) => {
    try {
        const { productIds } = req.body; // Array of product IDs to delete
        if (!productIds || !Array.isArray(productIds)) {
            return res.status(400).json({ message: 'Invalid product IDs' });
        }

        await Product.deleteMany({ _id: { $in: productIds } }); // Deletes products with the given IDs
        res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting products', error });
    }
}