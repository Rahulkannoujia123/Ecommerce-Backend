const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
  promoCode: {
    type: String,
    required: true, // Ensure the promocode is always provided
  },
  type: {
    type: String,
    enum: ['percentage', 'amount', 'timespan'], // Include 'timespan' in the enum for clarity
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  timespan: {
    start: {
      type: Date,
     
      // Only required if type is 'timespan'
    
    },
    end: {
      type: Date,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Promocode = mongoose.model('Promocode', promocodeSchema);

module.exports = Promocode;
