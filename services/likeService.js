const { Like, User, Recipe } = require('../models');

const likeService = {
    async toggleLike(userId, recipeId) {
        const user = await User.findByPk(userId);
        const recipe = await Recipe.findByPk(recipeId);
        if (!user || !recipe) {
            throw new Error('User or Recipe not found');
        }

        const existingLike = await Like.findOne({ where: { user_id: userId, recipe_id: recipeId } });
        if (existingLike) {
            await existingLike.destroy();
            return null;
        } else {
            return Like.create({ user_id: userId, recipe_id: recipeId });
        }
    },

    async deleteLike(userId, recipeId) {
        const like = await Like.findOne({ where: { user_id: userId, recipe_id: recipeId } });
        if (!like) {
            throw new Error('Like not found');
        }
        await like.destroy();
    },

    async isLikedByUser(userId, recipeId) {
        return !!(await Like.findOne({ where: { user_id: userId, recipe_id: recipeId } }));
    },

    async getLikesByUser(userId) {
        return Like.findAll({ where: { user_id: userId } });
    },

    async getLikesByRecipe(recipeId) {
        return Like.findAll({ where: { recipe_id: recipeId } });
    },

    async getLikeCountByRecipe(recipeId) {
        return Like.count({ where: { recipe_id: recipeId } });
    },
};

module.exports = likeService;