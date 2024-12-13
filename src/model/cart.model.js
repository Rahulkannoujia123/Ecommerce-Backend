const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem', // Reference to the MenuItem model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, // Minimum quantity should be 1
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
