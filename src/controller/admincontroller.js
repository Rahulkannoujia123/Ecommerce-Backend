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



