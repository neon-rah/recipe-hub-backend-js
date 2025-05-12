module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        idNotif: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_notif',
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user',
            },
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user',
            },
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_read',
        },
        seen :{
            type: DataTypes.BOOLEAN,
            allowNull :false,
            defaultValue: false,
            field: 'is_seen',
        },
        relatedEntityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'related_entity_id',
        },
        entityType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'entity_type',
        },
    }, {
        tableName: 'notifications',
        timestamps: false,
    });

    return Notification;
};