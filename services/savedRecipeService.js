const { SavedRecipe, User, Recipe } = require('../models');

const savedRecipeService = {
    async toggleSavedRecipe(userId, recipeId) {
        const existing = await SavedRecipe.findOne({ where: { user_id: userId, recipe_id: recipeId } });
        if (existing) {
            await existing.destroy();
            return null;
        } else {
            const user = await User.findByPk(userId);
            const recipe = await Recipe.findByPk(recipeId);
            if (!user || !recipe) throw new Error('User or Recipe not found');
            return SavedRecipe.create({ user_id: userId, recipe_id: recipeId });
        }
    },

    async removeSavedRecipe(userId, recipeId) {
        const savedRecipe = await SavedRecipe.findOne({ where: { user_id: userId, recipe_id: recipeId } });
        if (!savedRecipe) throw new Error('Saved recipe not found');
        await savedRecipe.destroy();
    },

    async getSavedRecipes(userId) {
        return SavedRecipe.findAll({ where: { user_id: userId } });
    },

    async isSavedRecipe(userId, recipeId) {
        return !!(await SavedRecipe.findOne({ where: { user_id: userId, recipe_id: recipeId } }));
    },

    async clearAllSavedRecipes(userId) {
        await SavedRecipe.destroy({ where: { user_id: userId } });
    },

    async getSavedRecipesPaged(userId, page, size, category) {
        const where = { user_id: userId };
        if (category && category !== 'All') {
            where['$recipe.category$'] = category;
        }

        const savedRecipes = await SavedRecipe.findAll({
            where,
            include: [{ model: Recipe, as: 'recipe' }],
            order: [['dateSaved', 'DESC']],
            limit: size,
            offset: page * size,
        });

        const total = await SavedRecipe.count({ where });
        return {
            content: savedRecipes.map(sr => recipeService.toDTO(sr.recipe)),
            total,
        };
    },
};

module.exports = savedRecipeService;