const userService = require('../services/userService');

const userController = {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body, req.files?.profilePic);
            res.json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async findUserById(req, res) {
        try {
            const user = await userService.findUserById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getUserProfileFromToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ error: 'Missing Authorization header' });
            const user = await userService.getUserProfileFromToken(token);
            res.json(user);
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    },

    async findUserByEmail(req, res) {
        try {
            const user = await userService.findUserByEmail(req.params.email);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async findAllUsers(req, res) {
        const users = await userService.findAllUsers();
        res.json(users);
    },

    async existsUserByEmail(req, res) {
        const exists = await userService.existsUserByEmail(req.params.email);
        res.json(exists);
    },

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.id, req.body, req.files?.profileImage);
            res.json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async deleteUser(req, res) {
        try {
            await userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async verifyPassword(req, res) {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: 'Password is required' });
        const isValid = await userService.verifyPassword(req.params.id, password);
        res.json(isValid);
    },

    async changePassword(req, res) {
        const { newPassword } = req.body;
        if (!newPassword) return res.status(400).json({ error: 'New password is required' });
        await userService.changePassword(req.params.id, newPassword);
        res.status(204).send();
    },

    async getUserProfile(req, res) {
        try {
            const user = await userService.getUserProfile(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = userController;