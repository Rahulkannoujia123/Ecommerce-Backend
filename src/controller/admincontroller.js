const Admin = require('../model/admin.model'); // Adjust the path as necessary

// Add a new user
exports. addUser = async (req, res) => {
    try {
        const user = new Admin(req.body);
        await user.save();
        res.status(201).send({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).send({ error: 'Failed to create user', details: error });
    }
};

// Assign a role to an existing user
exports.addUserRole = async (req, res) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        return res.status(400).send({ error: 'User ID and role are required' });
    }

    try {
        const user = await Admin.findById(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).send({ message: 'Role updated successfully', user });
    } catch (error) {
        res.status(400).send({ error: 'Failed to update role', details: error });
    }
};
// Get all users or a single user by ID
exports.getUsers = async (req, res) => {
    const { userId } = req.query; // Optional userId for fetching a single user

    try {
        if (userId) {
            const user = await Admin.findById(userId);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            res.status(200).send({ user });
        } else {
            const users = await Admin.find();
            res.status(200).send({ users });
        }
    } catch (error) {
        res.status(400).send({ error: 'Failed to fetch users', details: error });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    try {
        const user = await Admin.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Failed to delete user', details: error });
    }
};

// Edit an existing user by ID
exports.editUser = async (req, res) => {
    const { userId } = req.query;
    const updates = req.body; // Contains fields to be updated

    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }

    try {
        const user = await Admin.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(400).send({ error: 'Failed to update user', details: error });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Admin.find(); // Fetch all users from the database
        res.status(200).send({ message: 'Users fetched successfully', users });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch users', details: error });
    }
};
exports.deleteMultipleUser= async (req, res) => {
    try {
      const { userIds } = req.body; // Array of user IDs to delete
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: 'Invalid user IDs' });
      }
  
      await Admin.deleteMany({ _id: { $in: userIds } }); // Deletes users with the given IDs
      res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete users' });
    }
  }
  