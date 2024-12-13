const bcrypt = require('bcrypt');

// Middleware to hash passwords
exports.hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // Replace plain text password with hashed password
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to compare passwords
exports.comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};
