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
  
      // Create a new banner document
      const newBanner = await Banner.create({
        name,
        image: imageUrl || null, // Save the image URL if it exists, otherwise save null
      });
  
      res.status(201).json({
        message: 'Banner added successfully',
        banner: newBanner, // Return the newly created banner object
      });
    } catch (error) {
      console.error('Error while adding banner:', error);
      res.status(500).json({ message: 'An error occurred while adding the banner.' });
    }
  };
  
  
  
exports.bannerList = async (req, res) => {
    try {
        // Fetch all banners from the database
        const banners = await Banner.find(); // You can add filters or pagination if needed

        if (banners.length === 0) {
            return res.status(400).json({ message: 'No banners found' });
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
exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.query; // Extract banner ID from the URL parameter
        const { name } = req.body; // Extract new name from the request body

        // Check if the banner exists
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Check if a new image is uploaded and upload it to Cloudinary
        let imageUrl = banner.image; // Keep the existing image URL if no new image is uploaded
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

        // Update the banner in the database
        banner.name = name || banner.name; // Update name if it's provided
        banner.image = imageUrl; // Update image if a new one was uploaded

        // Save the updated banner
        await banner.save();

        res.status(200).json({
            message: 'Banner updated successfully',
            banner, // Return the updated banner
        });
    } catch (error) {
        console.error('Error while updating banner:', error);
        res.status(500).json({ message: 'An error occurred while updating the banner.' });
    }
};
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.query; // Extract banner ID from the URL parameter

        // Check if the banner exists
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

       

        // Delete the banner from the database
        await banner.remove();

        res.status(200).json({
            message: 'Banner deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting banner:', error);
        res.status(500).json({ message: 'An error occurred while deleting the banner.' });
    }
};
