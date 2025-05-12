const { Recipe, User } = require('../models');
const fileStorageService = require('./fileStorage');
const notificationService = require('./notificationService');
const { Op } = require('sequelize');
const recipeMapper = require('../mappers/recipeMapper');

const recipeService = {
    async createRecipe(recipeData, recipeImage, userId) {
        let image = null;
        if (recipeImage && recipeImage.size > 0) {
            image = await fileStorageService.storeFile(recipeImage, 'recipe', null);
        }

        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        const recipeDTO = recipeMapper.toRecipeDTO(recipeData);
        const recipe = await Recipe.create({
            ...recipeDTO,
            image,
            user_id: userId,
        });

        await notificationService.sendRecipePublicationNotification(userId, recipe.idRecipe, recipe.title);
        return recipeMapper.toDTO(recipe);
    },

    async updateRecipe(recipeId, updatedRecipeData, newRecipeImage, userId) {
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) throw new Error('Recipe not found');
        if (recipe.user_id !== userId) throw new Error('Unauthorized');

        const updatedDTO = recipeMapper.toRecipeDTO(updatedRecipeData);
        if (newRecipeImage && newRecipeImage.size > 0) {
            updatedDTO.image = await fileStorageService.storeFile(newRecipeImage, 'recipe', recipe.image);
        }

        await recipe.update(updatedDTO);
        return recipeMapper.toDTO(recipe);
    },

    async findRecipeById(recipeId) {
        const recipe = await Recipe.findByPk(recipeId);
        return recipe ? recipeMapper.toDTO(recipe) : null;
    },

    async findAllRecipes() {
        const recipes = await Recipe.findAll();
        return recipes.map(r => recipeMapper.toDTO(r));
    },

    async findRecipesByUserId(userId) {
        const recipes = await Recipe.findAll({
            where: { user_id: userId },
            order: [['updatedDate', 'DESC']],
        });
        return recipes.map(r => recipeMapper.toDTO(r));
    },

    async deleteRecipe(recipeId) {
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) throw new Error('Recipe not found');
        if (recipe.image) await fileStorageService.deleteFile(recipe.image);
        await recipe.destroy();
    },

    async searchRecipes(title, ingredient, category) {
        const where = {};
        if (title) where.title = { [Op.iLike]: `%${title}%` };
        if (ingredient) where.ingredients = { [Op.iLike]: `%${ingredient}%` };
        if (category) where.category = category;

        const recipes = await Recipe.findAll({ where });
        return recipes.map(r => recipeMapper.toDTO(r));
    },

    async findRecipesExcludingUser(userId, page, size) {
        const recipes = await Recipe.findAll({
            where: { user_id: { [Op.ne]: userId } },
            order: [['updatedDate', 'DESC']],
            limit: size,
            offset: page * size,
        });
        return {
            content: recipes.map(r => recipeMapper.toDTO(r)),
            total: await Recipe.count({ where: { user_id: { [Op.ne]: userId } } }),
        };
    },

    async searchRecipesExcludingUser(userId, query, page, size) {
        const recipes = await Recipe.findAll({
            where: {
                user_id: { [Op.ne]: userId },
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },
                    { ingredients: { [Op.iLike]: `%${query}%` } },
                ],
            },
            order: [['updatedDate', 'DESC']],
            limit: size,
            offset: page * size,
        });
        return {
            content: recipes.map(r => recipeMapper.toDTO(r)),
            total: await Recipe.count({
                where: {
                    user_id: { [Op.ne]: userId },
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${query}%` } },
                        { ingredients: { [Op.iLike]: `%${query}%` } },
                    ],
                },
            }),
        };
    },

    async findRecipesExcludingUserByCategory(userId, category, page, size) {
        const where = { user_id: { [Op.ne]: userId } };
        if (category && category !== 'All') where.category = category;

        const recipes = await Recipe.findAll({
            where,
            order: [['updatedDate', 'DESC']],
            limit: size,
            offset: page * size,
        });
        return {
            content: recipes.map(r => recipeMapper.toDTO(r)),
            total: await Recipe.count({ where }),
        };
    },

    async searchRecipesExcludingUserByCategory(userId, query, category, page, size) {
        const where = {
            user_id: { [Op.ne]: userId },
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { ingredients: { [Op.iLike]: `%${query}%` } },
            ],
        };
        if (category && category !== 'All') where.category = category;

        const recipes = await Recipe.findAll({
            where,
            order: [['updatedDate', 'DESC']],
            limit: size,
            offset: page * size,
        });
        return {
            content: recipes.map(r => recipeMapper.toDTO(r)),
            total: await Recipe.count({ where }),
        };
    },

    async getRandomRecipeExcludingUser(userId) {
        const recipes = await Recipe.findAll({ where: { user_id: { [Op.ne]: userId } } });
        if (!recipes.length) throw new Error('No recipes available');
        const randomIndex = Math.floor(Math.random() * recipes.length);
        return recipeMapper.toDTO(recipes[randomIndex]);
    },

    toDTO(recipe) {
        return {
            id: recipe.idRecipe,
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            preparation: recipe.preparation,
            category: recipe.category,
            image: recipe.image,
            creationDate: recipe.creationDate,
            updatedDate: recipe.updatedDate,
            userId: recipe.user_id,
        };
    },
};

module.exports = recipeService;