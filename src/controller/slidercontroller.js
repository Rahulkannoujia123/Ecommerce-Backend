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