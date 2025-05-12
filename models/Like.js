module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        idLike: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_like',
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user',
            },
        },
        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'recipes',
                key: 'id_recipe',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'likes',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'recipe_id'],
            },
        ],
    });

    return Like;
};