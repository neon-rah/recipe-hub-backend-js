module.exports = (sequelize, DataTypes) => {
    const Recipe = sequelize.define('Recipe', {
        idRecipe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_recipe',
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        preparation: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'creation_date',
        },
        updatedDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updated_date',
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user',
            },
        },
    }, {
        tableName: 'recipes',
        timestamps: false,
    });

    return Recipe;
};