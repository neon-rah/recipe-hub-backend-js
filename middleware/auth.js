const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const accessTokenExpiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION;
const refreshTokenExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION;

// Générer un access token
const generateAccessToken = (userId, email) => {
    return jwt.sign(
        { userId: userId.toString(), email },
        jwtSecret,
        { expiresIn: parseInt(accessTokenExpiration) / 1000 } // Convertir ms en secondes
    );
};

// Générer un refresh token
const generateRefreshToken = (userId, email) => {
    return jwt.sign(
        { userId: userId.toString(), email },
        jwtSecret,
        { expiresIn: parseInt(refreshTokenExpiration) / 1000 }
    );
};

// Extraire l'email depuis le token
const extractEmail = (token) => {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.email;
};

// Extraire l'userId depuis le token
const extractUserId = (token) => {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
};

// Middleware pour valider le token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Accès refusé' });
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = { userId: decoded.userId, email: decoded.email };
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    extractEmail,
    extractUserId,
    authenticateToken,
};