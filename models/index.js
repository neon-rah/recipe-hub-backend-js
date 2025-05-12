const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Connexion à PostgreSQL
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Importer tous les modèles
const User = require('./User')(sequelize, DataTypes);
const Recipe = require('./Recipe')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const SavedRecipe = require('./SavedRecipe')(sequelize, DataTypes);
const Like = require('./Like')(sequelize, DataTypes);
const Follower = require('./Follower')(sequelize, DataTypes);

// Définir les relations
// User -> Recipe (OneToMany)
User.hasMany(Recipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'user_id' });

// User -> Notification (OneToMany)
User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Notification -> Sender (ManyToOne)
Notification.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// User -> Like (OneToMany)
User.hasMany(Like, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'user_id' });

// User -> SavedRecipe (OneToMany)
User.hasMany(SavedRecipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavedRecipe.belongsTo(User, { foreignKey: 'user_id' });

// User -> Follower (OneToMany)
User.hasMany(Follower, { foreignKey: 'follower_id', onDelete: 'CASCADE', as: 'followersList' });
User.hasMany(Follower, { foreignKey: 'followed_id', onDelete: 'CASCADE', as: 'followingList' });
Follower.belongsTo(User, { foreignKey: 'follower_id', as: 'follower' });
Follower.belongsTo(User, { foreignKey: 'followed_id', as: 'followed' });

// Recipe -> Like (OneToMany)
Recipe.hasMany(Like, { foreignKey: 'recipe_id', onDelete: 'CASCADE' });
Like.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// Recipe -> SavedRecipe (OneToMany)
Recipe.hasMany(SavedRecipe, { foreignKey: 'recipe_id', onDelete: 'CASCADE' });
SavedRecipe.belongsTo(Recipe, { foreignKey: 'recipe_id' });

// User -> User (ManyToMany via Follower)
User.belongsToMany(User, {
    through: Follower,
    foreignKey: 'followed_id',
    otherKey: 'follower_id',
    as: 'followers',
});
User.belongsToMany(User, {
    through: Follower,
    foreignKey: 'follower_id',
    otherKey: 'followed_id',
    as: 'following',
});

// Test de connexion
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à PostgreSQL réussie');
        // Pas de sync pour ne pas modifier la base existante
    } catch (error) {
        console.error('Erreur de connexion:', error);
    }
};

connectDB();

module.exports = { sequelize, DataTypes, User, Recipe, Notification, SavedRecipe, Like, Follower };