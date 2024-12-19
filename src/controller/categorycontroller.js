const Category = require("../model/category.model"); // Ensure this points to your model
const cloudinary = require("cloudinary").v2;
const Subcategory = require("../model/subcategory.model");
//const MenuItem=require('../model/item.model')

// Controller function to handle home updates
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body; // Expecting name in the request body

    // Check if an image file was uploaded
    let imageUrl = null;
    if (req.files && req.files.image && req.files.image[0]) {
      const imageFile = req.files.image[0];

      // Upload image to Cloudinary
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "banners", resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(imageFile.buffer); // End the stream with the file buffer
      });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      image: imageUrl,
    });

    await newCategory.save();

    // Respond with the created category and its image URL
    res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
      // Include the image URL in the response
    });
  } catch (error) {
    console.error("Error while adding category:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the category." });
  }
};

exports.CategoryList = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories"); // Fetch all categories with populated subcategories

    if (categories.length === 0) {
      return res.status(404).json({
        message: "No categories found.",
      }); // Custom message if no categories are found
    }

    res.status(200).json({
      message: "Categories fetched successfully.",
      data: categories,
    }); // Success message along with the data
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories.",
      error: error.message,
    }); // Custom error message
  }
};
exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId, name } = req.body; // Expecting categoryId and name in the request body

    // Find the category to which the subcategory will be added
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if an image file was uploaded
    let imageUrl = null;
    if (req.files && req.files.image && req.files.image[0]) {
      const imageFile = req.files.image[0];

      // Upload image to Cloudinary
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "subcategories", resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        uploadStream.end(imageFile.buffer); // End the stream with the file buffer
      });
    }

    // Create a new subcategory
    const newSubcategory = new Subcategory({
      name,
      image: imageUrl, // Set the uploaded image URL
      categoryId: category._id, // Set the categoryId reference to the category
    });

    await newSubcategory.save(); // Save the new subcategory with the categoryId

    // Push the subcategory into the category's subcategories array
    category.subcategories.push(newSubcategory._id); // Push the subcategory ID into the category's subcategories
    await category.save(); // Save the updated category

    res.status(201).json({
      message: "Subcategory added successfully",
      subcategory: newSubcategory, // Return the new subcategory
    });
  } catch (error) {
    console.error("Error while adding subcategory:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the subcategory." });
  }
};
exports.getMenuItemsByCategoryId = async (req, res) => {
  const { categoryId } = req.query; // Get categoryId from request parameters

  try {
    // Find all subcategories that belong to the specified categoryId
    const subcategories = await Subcategory.find({
      categoryId: categoryId,
    }).select("_id");

    if (subcategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No subcategories found for this category." });
    }

    // Extract the subcategory IDs to search for MenuItems
    const subcategoryIds = subcategories.map((subcategory) => subcategory._id);

    // Find all menu items that belong to any of the subcategory IDs
    const menuItems = await MenuItem.find({
      subcategory: { $in: subcategoryIds },
    });

    // Check if any menu items were found
    if (menuItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No menu items found for this category." });
    }

    res.status(200).json(menuItems); // Respond with the found menu items
  } catch (err) {
    console.error("Error fetching menu items:", err); // Log error details
    res.status(500).json({ message: err.message }); // Send error response
  }
};
exports.subcategoryList = async (req, res) => {
  try {
    // Find all subcategories
    const subcategories = await Subcategory.find();

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ message: "No subcategories found" });
    }

    return res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
 // Adjust path to your Category model

// Update category controller
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.query; // Extract category ID from query params
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const { name } = req.body || {}; // Extract name from request body
    if (!name && (!req.files || !req.files.image)) {
      return res
        .status(400)
        .json({ message: "At least one field (name or image) must be provided" });
    }

    // Log received data for debugging
    console.log("Updating category with ID:", id);
    console.log("Request body:", req.body);

    // Check if an image file was uploaded
    let imageUrl = null;
    if (req.files && req.files.image && req.files.image[0]) {
      const imageFile = req.files.image[0];
      console.log("Uploading image to Cloudinary...");

      try {
        // Upload image to Cloudinary
        imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "banners", resource_type: "image" },
            (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
                return reject(error);
              }
              console.log("Cloudinary upload result:", result);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(imageFile.buffer); // End the stream with the file buffer
        });
      } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error });
      }
    }

    // Prepare update data
    const updateData = {
      ...(name && { name }), // Include name only if it exists
      ...(imageUrl && { image: imageUrl }), // Include image only if it exists
    };

    console.log("Update data:", updateData);

    // Find the category by ID and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      id, // Find the category by ID
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated category and apply validators
    );

    // If category not found, return an error
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Respond with the updated category
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error while updating category:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the category.", error });
  }
};

