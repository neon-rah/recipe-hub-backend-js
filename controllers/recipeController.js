const recipeService = require('../services/recipeService');

const recipeController = {
    async createRecipe(req, res) {
        try {
            const recipe = await recipeService.createRecipe(req.body, req.files?.image, req.user.idUser);
            res.json(recipe);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async updateRecipe(req, res) {
        try {
            const recipe = await recipeService.updateRecipe(req.params.id, req.body, req.files?.image, req.user.idUser);
            res.json(recipe);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async findRecipeById(req, res) {
        try {
            const recipe = await recipeService.findRecipeById(req.params.id);
            if (!recipe || recipe.userId !== req.user.idUser) return res.status(403).json({ error: 'Forbidden' });
            res.json(recipe);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    async findAllRecipes(req, res) {
        const recipes = await recipeService.findAllRecipes();
        res.json(recipes);
    },

    async findRecipesByUserId(req, res) {
        const recipes = await recipeService.findRecipesByUserId(req.params.userId);
        res.json(recipes);
    },

    async deleteRecipe(req, res) {
        try {
            await recipeService.deleteRecipe(req.params.id);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async searchRecipes(req, res) {
        const { title, ingredient, category } = req.query;
        const recipes = await recipeService.searchRecipes(title, ingredient, category);
        res.json(recipes);
    },

    async getPublicRecipes(req, res) {
        const { page = 0, size = 12, category } = req.query;
        const recipes = category && category !== 'All'
            ? await recipeService.findRecipesExcludingUserByCategory(req.user.idUser, category, page, size)
            : await recipeService.findRecipesExcludingUser(req.user.idUser, page, size);
        res.json(recipes);
    },

    async searchPublicRecipes(req, res) {
        const { page = 0, size = 12, query, category } = req.query;
        if (!query) return res.status(400).json({ error: 'Query parameter is required' });
        const recipes = category && category !== 'All'
            ? await recipeService.searchRecipesExcludingUserByCategory(req.user.idUser, query, category, page, size)
            : await recipeService.searchRecipesExcludingUser(req.user.idUser, query, page, size);
        res.json(recipes);
    },

    async getRandomRecipe(req, res) {
        try {
            const recipe = await recipeService.getRandomRecipeExcludingUser(req.user.idUser);
            res.json(recipe);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};

module.exports = recipeController;