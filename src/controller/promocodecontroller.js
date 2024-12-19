const Promocode = require('../model/promocode.model'); // Import the model

// Create a new promocode
exports.createPromocode = async (req, res) => {
  try {
    const { promoCode, type, value, timespan } = req.body;

    // Validate timespan if type is 'timespan'
    if (type === 'timespan' && (!timespan.start || !timespan.end)) {
      return res.status(400).json({ message: 'Timespan start and end dates are required.' });
    }

    const promocode = new Promocode({
      promoCode,
      type,
      value,
      timespan: type === 'timespan' ? timespan : undefined,
    });

    const savedPromocode = await promocode.save();
    res.status(201).json(savedPromocode);
  } catch (err) {
    res.status(500).json({ message: 'Error creating promocode', error: err });
  }
};

// Get all promocodes
exports.getAllPromocodes = async (req, res) => {
  try {
    const promocodes = await Promocode.find();
    res.status(200).json(promocodes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching promocodes', error: err });
  }
};

// Get a promocode by ID
exports.getPromocodeById = async (req, res) => {
  try {
    const promocode = await Promocode.findById(req.params.id);
    if (!promocode) {
      return res.status(404).json({ message: 'Promocode not found' });
    }
    res.status(200).json(promocode);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching promocode', error: err });
  }
};

// Update a promocode by ID
exports.updatePromocode = async (req, res) => {
  try {
    const updatedPromocode = await Promocode.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!updatedPromocode) {
      return res.status(404).json({ message: 'Promocode not found' });
    }
    res.status(200).json(updatedPromocode);
  } catch (err) {
    res.status(500).json({ message: 'Error updating promocode', error: err });
  }
};

// Delete a promocode by ID
exports.deletePromocode = async (req, res) => {
  try {
    const deletedPromocode = await Promocode.findByIdAndDelete(req.params.id);
    if (!deletedPromocode) {
      return res.status(404).json({ message: 'Promocode not found' });
    }
    res.status(200).json({ message: 'Promocode deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting promocode', error: err });
  }
};
