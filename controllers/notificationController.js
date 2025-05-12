const notificationService = require('../services/notificationService');

const notificationController = {
    async createNotification(req, res) {
        const { title, message } = req.query;
        if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });

        try {
            const notification = await notificationService.createNotification(req.params.userId, title, message);
            res.status(201).json(notification);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getUserNotifications(req, res) {
        try {
            const notifications = await notificationService.getUserNotifications(req.params.userId);
            res.json(notifications);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getUnreadCount(req, res) {
        try {
            const count = await notificationService.getUnreadCount(req.params.userId);
            res.json(count);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async markAllAsRead(req, res) {
        try {
            await notificationService.markAllAsRead(req.params.userId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async deleteNotification(req, res) {
        try {
            await notificationService.deleteNotification(req.params.notifId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async deleteAllNotifications(req, res) {
        try {
            await notificationService.deleteAllNotifications(req.params.userId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async markAsRead(req, res) {
        try {
            await notificationService.markAsRead(req.params.notifId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getNotificationById(req, res) {
        try {
            const notification = await notificationService.getNotificationById(req.params.notifId);
            res.json(notification);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    // Nouvelles méthodes ajoutées
    async markAllAsSeen(req, res) {
        try {
            await notificationService.markAllAsSeen(req.params.userId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getUnseenCount(req, res) {
        try {
            const count = await notificationService.getUnseenCount(req.params.userId);
            res.json(count);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};

module.exports = notificationController;