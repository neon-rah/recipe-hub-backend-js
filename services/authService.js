const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken, extractEmail, extractUserId } = require('../middleware/auth');
const fileStorageService = require('./fileStorage');
const userMapper = require('../mappers/userMapper.js');

const saltRounds = 10;

const authService = {
    // Inscription
    async register(userData, profileImage, res) {
        const { email, password, lastName, firstName, address } = userData;

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email address already in use');
        }

        // Stocker l'image si fournie
        let profilePic = null;
        if (profileImage && profileImage.size > 0) {
            profilePic = await fileStorageService.storeFile(profileImage, 'user', null);
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const user = await User.create({
            lastName,
            firstName,
            email,
            password: hashedPassword,
            address,
            profilePic,
        });

        return authService.generateAuthResponse(user, res);
    },

    // Connexion
    async login(email, password, res) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        return authService.generateAuthResponse(user, res);
    },

    // Rafraîchir le token
    async refreshAccessToken(refreshToken) {
        const jwt = require('jsonwebtoken');
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const email = decoded.email;
            return generateAccessToken(userId, email);
        } catch (err) {
            throw new Error('Invalid or expired refresh token');
        }
    },

    // Vérifier la validité du refresh token
    async isRefreshTokenValid(refreshToken) {
        const jwt = require('jsonwebtoken');
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET);
            return true;
        } catch (err) {
            return false;
        }
    },

    // Générer la réponse d'authentification
    async generateAuthResponse(user, res) {
        const accessToken = generateAccessToken(user.idUser, user.email);
        const refreshToken = generateRefreshToken(user.idUser, user.email);

        // Ajouter le cookie refreshToken
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Mettre à true en production avec HTTPS
            path: '/',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });

        return {
            accessToken,
            user: userMapper.toDto(user)
        };
    },

    // Déconnexion
    logout(res) {
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: false,
            path: '/',
            maxAge: 0, // Expire immédiatement
        });
        return { message: 'Déconnexion réussie' };
    },
};

module.exports = authService;