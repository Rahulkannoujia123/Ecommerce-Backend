const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,  // URL or file path of the image
    required: true,
  },
  link: {
    type: String,  // URL that the slider will redirect to
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;
