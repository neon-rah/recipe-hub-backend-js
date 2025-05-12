const { Notification, User, Follower } = require('../models');
const io = require('../index').io; // Importe Socket.io depuis index.js
const notificationMapper = require('../mappers/notificationMapper');

const notificationService = {
    async createNotification(userId, title, message) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        const notification = await Notification.create({ user_id: userId, title, message });
        return notificationMapper.toDTO(notification);
    },

    async getUserNotifications(userId) {
        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'sender' }],
        });
        return Promise.all(notifications.map(n => notificationMapper.toDTO(n)));
    },

    async getUnreadCount(userId) {
        return Notification.count({ where: { user_id: userId, read: false } });
    },

    async markAllAsRead(userId) {
        await Notification.update(
            { read: true },
            { where: { user_id: userId, read: false } }
        );
    },

    async deleteNotification(notificationId) {
        await Notification.destroy({ where: { idNotif: notificationId } });
    },

    async deleteAllNotifications(userId) {
        await Notification.destroy({ where: { user_id: userId } });
    },

    async getNotificationById(notificationId) {
        const notification = await Notification.findByPk(notificationId, {
            include: [{ model: User, as: 'sender' }],
        });
        if (!notification) throw new Error('Notification not found');
        return notificationMapper.toDTO(notification);
    },

    async markAsRead(notificationId) {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) throw new Error('Notification not found');
        notification.read = true;
        await notification.save();
    },

    async sendFollowNotification(followerId, followedId) {
        const follower = await User.findByPk(followerId);
        const followed = await User.findByPk(followedId);
        if (!follower || !followed) throw new Error('User not found');

        const notification = await Notification.create({
            user_id: followedId,
            sender_id: followerId,
            title: 'New follower',
            message: `${follower.firstName || ''} ${follower.lastName} follows you.`,
            entityType: 'user',
        });

        const notificationDTO = await notificationMapper.toDTO(notification);
        io.emit(`notifications/${followedId}`, notificationDTO);
        return notificationDTO; // Retourne pour éventuelle utilisation
    },

    async sendRecipePublicationNotification(userId, recipeId, recipeTitle) {
        const author = await User.findByPk(userId);
        if (!author) throw new Error('User not found');

        const followers = await Follower.findAll({
            where: { followed_id: userId },
            include: [{ model: User, as: 'follower' }],
        });

        if (!followers.length) return;

        const title = 'New recipe';
        const message = `${author.firstName || ''} ${author.lastName} published a new recipe: ${recipeTitle}`;

        const notifications = [];
        for (const follower of followers) {
            const notification = await Notification.create({
                user_id: follower.follower.idUser,
                sender_id: userId,
                title,
                message,
                relatedEntityId: recipeId,
                entityType: 'recipe',
            });

            const notificationDTO = await notificationMapper.toDTO(notification);
            io.emit(`notifications/${follower.follower.idUser}`, notificationDTO);
            notifications.push(notificationDTO);
        }
        return notifications; // Retourne la liste pour éventuelle utilisation
    },

    // Nouvelles méthodes ajoutées
    async markAllAsSeen(userId) {
        const unseenNotifications = await Notification.findAll({
            where: { user_id: userId, seen: false },
        });
        for (const notification of unseenNotifications) {
            notification.seen = true;
            await notification.save();
        }
    },

    async getUnseenCount(userId) {
        return Notification.count({ where: { user_id: userId, seen: false } });
    },
};

module.exports = notificationService;