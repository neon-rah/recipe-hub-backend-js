module.exports = (sequelize, DataTypes) => {
    const Follower = sequelize.define('Follower', {
        idFollow: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_follow',
        },
        follower_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user',
            },
        },
        followed_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user',
            },
        },
        followedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'followed_at',
        },
    }, {
        tableName: 'followers',
        timestamps: false,
    });

    return Follower;
};