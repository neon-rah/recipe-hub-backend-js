const savedRecipeService = require('../services/savedRecipeService');

const savedRecipeController = {
    async toggleSavedRecipe(req, res) {
        try {
            const savedRecipe = await savedRecipeService.toggleSavedRecipe(req.user.idUser, req.params.recipeId);
            res.status(savedRecipe ? 201 : 200).json(savedRecipe);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async removeSavedRecipe(req, res) {
        try {
            await savedRecipeService.removeSavedRecipe(req.user.idUser, req.params.recipeId);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async getSavedRecipes(req, res) {
        const savedRecipes = await savedRecipeService.getSavedRecipes(req.user.idUser);
        res.json(savedRecipes);
    },

    async isRecipeSaved(req, res) {
        const exists = await savedRecipeService.isSavedRecipe(req.user.idUser, req.params.recipeId);
        res.json(exists);
    },

    async clearAllSavedRecipes(req, res) {
        await savedRecipeService.clearAllSavedRecipes(req.user.idUser);
        res.status(204).send();
    },

    async getSavedRecipesPaged(req, res) {
        const { page = 0, size = 12, category } = req.query;
        const savedRecipes = await savedRecipeService.getSavedRecipesPaged(req.user.idUser, page, size, category);
        res.json(savedRecipes);
    },
};

module.exports = savedRecipeController;