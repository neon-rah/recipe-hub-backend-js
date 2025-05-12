const authService = require('../services/authService');
const Joi = require('joi');

const registerSchema = Joi.object({
    lastName: Joi.string().required(),
    firstName: Joi.string().allow(''),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const authController = {
    async register(req, res) {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const result = await authService.register(req.body, req.files?.profilePic, res);
            res.json(result);
        } catch (err) {
            const status = err.message === 'Email address already in use' ? 400 : 500;
            res.status(status).json({ error: err.message });
        }
    },

    async login(req, res) {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const result = await authService.login(req.body.email, req.body.password, res);
            res.json(result);
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    },

    async verifyRefreshToken(req, res) {
        let refreshToken = req.body?.refreshToken || req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ valid: false });

        try {
            const isValid = await authService.isRefreshTokenValid(refreshToken);
            res.json({ valid: isValid });
        } catch (err) {
            res.status(500).json({ valid: false });
        }
    },

    async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ error: 'No refresh token provided' });

        try {
            const newAccessToken = await authService.refreshAccessToken(refreshToken);
            res.json({ accessToken: newAccessToken });
        } catch (err) {
            res.status(401).json({ error: 'Token refresh failed' });
        }
    },

    logout(req, res) {
        try {
            const result = authService.logout(res);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = authController;