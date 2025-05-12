const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { corsOptions } = require('./config');
const { authenticateToken } = require('./middleware/auth');
const errorHandler = require('./middleware/error');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

// Créer un serveur HTTP pour Express et Socket.io
const server = createServer(app);
const io = new Server(server, {
    path: '/ws', // Correspond à ton endpoint /ws
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ createParentPath: true }));

// Routes publiques (auth)
app.use('/api/auth', apiRoutes);

// Routes protégées (avec JWT)
app.use('/api', authenticateToken, apiRoutes);

// WebSocket avec Socket.io (simule STOMP)
io.on('connection', (socket) => {
    console.log('Client WebSocket connecté:', socket.id);

    // Simule STOMP /app (messages envoyés au backend)
    socket.on('message', (msg) => {
        console.log('Message reçu:', msg);
        // Simule /topic ou /queue (broadcast à tous les clients)
        io.emit('topic', msg); // Émule /topic
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
        console.log('Client déconnecté:', socket.id);
    });
});

// Gestion des erreurs
app.use(errorHandler);

// Lancer le serveur
server.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});

// Connexion à la base de données
sequelize.authenticate()
    .then(() => console.log('Connexion à PostgreSQL réussie'))
    .catch(err => console.error('Erreur de connexion:', err));

// Exposer io pour les services
module.exports = { io };