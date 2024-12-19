const Promocode = require('../model/promocode.model'); // Import the model

// Create a new promocode
exports.addPromocode = async (req, res) => {
    try {
      const { promoCode, type, value, timespan } = req.body;
  
      // Log the timespan to the console (for debugging)
      console.log('Timespan:', timespan);
  
      // Validate timespan if type is 'timespan'
      if (type === 'timespan' && (!timespan || !timespan.start || !timespan.end)) {
        return res.status(400).json({ message: 'Timespan start and end dates are required.' });
      }
  
      // Create a new Promocode object
      const promocode = new Promocode({
        promoCode,
        type,
        value,
        timespan: timespan || undefined, // Include timespan only if provided
      });
  
      // Save the promocode to the database
      const savedPromocode = await promocode.save();
  
      // Return the saved promocode as the response
      res.status(201).json(savedPromocode);
    } catch (err) {
      res.status(500).json({ message: 'Error adding promocode', error: err });
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
      const { id } = req.query; // Extract the id from the query parameters
  
      // Validate if an id is provided
      if (!id) {
        return res.status(400).json({ message: 'Promocode ID is required' });
      }
  
      // Find the promocode by id and update it with the provided data in the request body
      const updatedPromocode = await Promocode.findByIdAndUpdate(id, req.body, { new: true });
  
      // If the promocode is not found, return a 404 error
      if (!updatedPromocode) {
        return res.status(404).json({ message: 'Promocode not found' });
      }
  
      // Return the updated promocode and a success message
      res.status(200).json({ message: 'Promocode updated successfully', updatedPromocode });
  
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: 'Error updating promocode', error: err.message });
    }
  };

// Delete a promocode by ID
exports.deletePromocode = async (req, res) => {
  try {
    const deletedPromocode = await Promocode.findByIdAndDelete(req.query.id);
    if (!deletedPromocode) {
      return res.status(404).json({ message: 'Promocode not found' });
    }
    res.status(200).json({ message: 'Promocode deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting promocode', error: err });
  }
};
