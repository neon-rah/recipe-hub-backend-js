const notificationMapper = {
    async toDTO(notification) {
        const sender = await notification.getSender(); // Charge l'utilisateur sender via Sequelize
        return {
            idNotif: notification.idNotif,
            idUser: notification.user_id,
            senderId: notification.sender_id,
            senderLastName: sender?.lastName || null,
            senderFirstName: sender?.firstName || null,
            senderEmail: sender?.email || null,
            senderProfilePic: sender?.profilePic || null,
            title: notification.title,
            message: notification.message,
            createdAt: notification.createdAt,
            read: notification.read,
            seen: notification.seen,
            relatedEntityId: notification.relatedEntityId,
            entityType: notification.entityType,
        };
    },

    toEntity(notificationDTO) {
        return {
            idNotif: notificationDTO.idNotif,
            user_id: notificationDTO.idUser,
            sender_id: notificationDTO.senderId,
            title: notificationDTO.title,
            message: notificationDTO.message,
            createdAt: notificationDTO.createdAt,
            read: notificationDTO.read,
            seen: notificationDTO.seen,
            relatedEntityId: notificationDTO.relatedEntityId,
            entityType: notificationDTO.entityType,
        };
    },
};

module.exports = notificationMapper;