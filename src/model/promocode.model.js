const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
    promoCode:{
        type:String,
    },
  type: {
    type: String,
    enum: ['percentage', 'amount', ],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
 
  timespan: {
    start: {
      type: Date,
      required: function() { return this.type === 'timespan'; }
    },
    end: {
      type: Date,
      required: function() { return this.type === 'timespan'; }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Promocode = mongoose.model('Promocode', promocodeSchema);

module.exports = Promocode;
