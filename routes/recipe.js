const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, recipeController.createRecipe);
router.put('/:id', authenticateToken, recipeController.updateRecipe);
router.get('/:id', authenticateToken, recipeController.findRecipeById);
router.get('/', authenticateToken, recipeController.findAllRecipes);
router.get('/user/:userId', authenticateToken, recipeController.findRecipesByUserId);
router.delete('/:id', authenticateToken, recipeController.deleteRecipe);
router.get('/search', authenticateToken, recipeController.searchRecipes);
router.get('/public', authenticateToken, recipeController.getPublicRecipes);
router.get('/public/search', authenticateToken, recipeController.searchPublicRecipes);
router.get('/random', authenticateToken, recipeController.getRandomRecipe);

module.exports = router;