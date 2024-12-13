// cartController.js

const Cart = require('../model/cart.model'); // Import the Cart model
const Product = require('../model/product.model'); // Import the Product model

/**
 * Add to Cart Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if the product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      existingCartItem.quantity += quantity;

      // Validate stock again after increment
      if (existingCartItem.quantity > product.stock) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated', cart: existingCartItem });
    }

    // Create a new cart item
    const newCartItem = new Cart({ userId, productId, quantity });
    await newCartItem.save();

    res.status(201).json({ message: 'Product added to cart', cart: newCartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get Cart Items Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch cart items for the user
    const cartItems = await Cart.find({ userId }).populate('productId');

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Remove from Cart Controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Remove the product from the user's cart
    const result = await Cart.findOneAndDelete({ userId, productId });

    if (!result) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
