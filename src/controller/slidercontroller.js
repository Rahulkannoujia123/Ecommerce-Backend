const Slider=require('../model/slider.model')
const cloudinary = require('cloudinary').v2;


exports.addSlider = async (req, res) => {
    try {
      const { name , link} = req.body; // Expecting the name in the request body for the banner
  
      // Check if an image file was uploaded
      let imageUrl = null;
      if (req.files && req.files.image && req.files.image[0]) {
        const imageFile = req.files.image[0];
  
        // Upload image to Cloudinary
        imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'banners', resource_type: 'image' },
            (error, result) => {
              if (error) {
                console.error('Error uploading to Cloudinary:', error);
                return reject(error);
              }
              resolve(result.secure_url);
            }
          );
          uploadStream.end(imageFile.buffer); // End the stream with the file buffer
        });
      }
  
      // Create a new banner document
      const newSlider = await Slider.create({
        name,
        link,
        image: imageUrl || null, // Save the image URL if it exists, otherwise save null
      });
  
      res.status(201).json({
        message: 'Slider added successfully',
        banner: newSlider, // Return the newly created banner object
      });
    } catch (error) {
      console.error('Error while adding banner:', error);
      res.status(500).json({ message: 'An error occurred while adding the banner.' });
    }
  };
  exports.sliderlist = async (req, res) => {
    try {
        // Fetch all banners from the database
        const slider = await Slider.find(); // You can add filters or pagination if needed

        if (slider.length === 0) {
            return res.status(400).json({ message: 'No slider found' });
        }

        res.status(200).json({
            message: 'Slider fetched successfully',
            slider, // Sending the banners in the response
        });
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ message: 'An error occurred while fetching banners.' });
    }
};
exports.updateSlider = async (req, res) => {
    try {
        const { id } = req.query; // Get the slider ID from the request parameters
        const { name, link } = req.body; // Get the updated name and link from the request body

        // Check if an image file was uploaded
        let imageUrl = null;
        if (req.files && req.files.image && req.files.image[0]) {
            const imageFile = req.files.image[0];

            // Upload the new image to Cloudinary
            imageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'banners', resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            return reject(error);
                        }
                        resolve(result.secure_url);
                    }
                );
                uploadStream.end(imageFile.buffer); // End the stream with the file buffer
            });
        }

        // Find the slider by ID and update the information
        const updatedSlider = await Slider.findByIdAndUpdate(
            id,
            {
                name,
                link,
                image: imageUrl || undefined, // Update the image if a new one is provided
            },
            { new: true } // Return the updated document
        );

        if (!updatedSlider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        res.status(200).json({
            message: 'Slider updated successfully',
            banner: updatedSlider,
        });
    } catch (error) {
        console.error('Error while updating slider:', error);
        res.status(500).json({ message: 'An error occurred while updating the slider.' });
    }
};
exports.deleteSlider = async (req, res) => {
    try {
        const { id } = req.query; // Get the slider ID from the request parameters

        // Find the slider by ID and delete it
        const deletedSlider = await Slider.findByIdAndDelete(id);

        if (!deletedSlider) {
            return res.status(404).json({ message: 'Slider not found' });
        }

        res.status(200).json({
            message: 'Slider deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting slider:', error);
        res.status(500).json({ message: 'An error occurred while deleting the slider.' });
    }
};
