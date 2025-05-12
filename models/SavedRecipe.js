module.exports = (sequelize, DataTypes) => {
    const SavedRecipe = sequelize.define('SavedRecipe', {
        idSave: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_save',
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
        dateSaved: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'date_saved',
        },
    }, {
        tableName: 'saved_recipes',
        timestamps: false,
    });

    return SavedRecipe;
};