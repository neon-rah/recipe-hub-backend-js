const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000', // Ton front Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', '*'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
};

module.exports = {
    corsOptions,
};