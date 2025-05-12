const path = require('path');
const fs = require('fs').promises;

const storagePath = path.resolve(process.env.UPLOAD_DIR);

const fileStorageService = {
    // Stocke un fichier et retourne l'URL relative
    storeFile: async (file, prefix, oldFileName) => {
        try {
            // Vérifie si le fichier est vide
            if (!file || file.size === 0) {
                throw new Error('Le fichier est vide.');
            }

            // Vérifie la taille (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('La taille du fichier dépasse la limite de 10MB.');
            }

            // Vérifie l'extension
            const fileExtension = path.extname(file.name).toLowerCase();
            const allowedExtensions = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('Type de fichier non autorisé. Extensions autorisées : jpg, png, jpeg.');
            }

            // Supprime l’ancien fichier s'il existe
            if (oldFileName) {
                await fileStorageService.deleteFile(oldFileName);
            }

            // Génère un nom unique
            const fileName = `${prefix}_${Date.now()}${fileExtension}`;
            const targetLocation = path.join(storagePath, fileName);

            // Déplace le fichier
            await file.mv(targetLocation);

            // Retourne l’URL relative
            return `/uploads/${fileName}`;
        } catch (err) {
            throw new Error(`Échec du stockage du fichier: ${err.message}`);
        }
    },

    // Supprime un fichier
    deleteFile: async (fileName) => {
        try {
            if (fileName) {
                const filePath = path.join(storagePath, fileName);
                await fs.unlink(filePath);
            }
        } catch (err) {
            throw new Error(`Erreur lors de la suppression du fichier: ${err.message}`);
        }
    },
};

module.exports = fileStorageService;