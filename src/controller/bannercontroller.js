const Banner=require('../model/banner.model')
const cloudinary = require('cloudinary').v2;


exports.addBanner = async (req, res) => {
    try {
      const { name } = req.body; // Expecting the name in the request body for the banner
  
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
  
      // Find and update the existing banner
      const updatedBanner = await Banner.findOneAndUpdate(
        {}, // Finds the first document (adjust the query to target a specific document if needed)
        { name, ...(imageUrl && { image: imageUrl }) }, // Update the name and image (if uploaded)
        { new: true } // Return the modified document but do not create a new one
      );
  
      if (!updatedBanner) {
        return res.status(404).json({ message: 'No existing banner found to update.' });
      }
  
      res.status(200).json({
        message: 'Banner updated successfully',
        banner: updatedBanner, // Return the updated banner object
      });
    } catch (error) {
      console.error('Error while updating banner:', error);
      res.status(500).json({ message: 'An error occurred while updating the banner.' });
    }
  };
  
  
exports.bannerList = async (req, res) => {
    try {
        // Fetch all banners from the database
        const banners = await Banner.find(); // You can add filters or pagination if needed

        if (banners.length === 0) {
            return res.status(404).json({ message: 'No banners found' });
        }

        // Return the list of banners
        res.status(200).json({
            message: 'Banners fetched successfully',
            banners, // Sending the banners in the response
        });
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ message: 'An error occurred while fetching banners.' });
    }
};