const express = require('express');
const router = express.Router();
const savedRecipeController = require('../controllers/savedRecipeController');
const { authenticateToken } = require('../middleware/auth');

router.post('/recipe/:recipeId', authenticateToken, savedRecipeController.toggleSavedRecipe);
router.delete('/recipe/:recipeId', authenticateToken, savedRecipeController.removeSavedRecipe);
router.get('/', authenticateToken, savedRecipeController.getSavedRecipes);
router.get('/exists/:recipeId', authenticateToken, savedRecipeController.isRecipeSaved);
router.delete('/', authenticateToken, savedRecipeController.clearAllSavedRecipes);
router.get('/paged', authenticateToken, savedRecipeController.getSavedRecipesPaged);

module.exports = router;