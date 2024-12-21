const User = require('../model/user.model');
// const Company=require('../model/company.model') 
//const ExcelJS = require('exceljs');// Adjust the path as necessary

// Registration API
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber,  } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create a new user with plain text password
        const newUser = new User({
            fullName,
            email,
            password,
            phoneNumber,
           // Save the companyId for reference
        });

        // Save the user to the database
        await newUser.save();

       

        // Respond with the user data along with the company name
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                ...newUser.toObject(), // Convert Mongoose document to plain object
              // Include company name in the response
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login API
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check the password (simple comparison)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find();

        // Return the response with the users
        res.status(200).json({
            message: 'Users fetched successfully',
            users: users
        });
    } catch (error) {
        // Handle errors and send a response
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
// Delete User API
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.query;

        // Find and delete the user by id
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            user: deletedUser // Optionally return the deleted user details
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
exports.exportUsersToExcel = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        // Add header row
        worksheet.columns = [
            { header: 'Full Name', key: 'fullName', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone Number', key: 'phoneNumber', width: 20 },
            { header: 'Company Name', key: 'companyName', width: 25 },
        ];

        // Populate data rows
        for (const user of users) {
            const company = await Company.findById(user.companyId); // Fetch company details
            worksheet.addRow({
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                companyName: company ? company.name : 'N/A',
            });
        }

        // Set the response headers for Excel file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=users.xlsx'
        );

        // Write the workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: 'Error exporting users', error });
    }
};
exports.updateUser = async (req, res) => {
    try {
      const { userId } = req.query; // Get the user ID from the route parameter
      const { fullName, email, phoneNumber, password } = req.body; // Get the updated user data from the request body
  
      // Check if the user exists in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user data
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.password = password || user.password; // You may want to hash the password before saving
  
      // Save the updated user
      await user.save();
  
      return res.status(200).json({
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.Userdetail = async (req, res) => {
    try {
      // Extract the user ID from the query parameters or URL params
      const userId =  req.query.userId;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Find the user by ID in the database
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user details
      return res.status(200).json({
        message: 'User details fetched successfully',
        user: user,
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({
        message: 'Error fetching user details',
        error: error.message,
      });
    }
  };

  // controllers/authController.js

const DEFAULT_EMAIL = "admin@gmail.com";
const DEFAULT_PASSWORD = "admin";

// Login controller
exports.adminlogin = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password match the default values
  if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
    return res.status(200).json({
      message: "Login successful",
      success: true,
    });
  } else {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }
};
